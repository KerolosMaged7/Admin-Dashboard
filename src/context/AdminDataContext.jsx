import { useEffect, useMemo, useState } from 'react'
import { activityData as seedActivity, productData as seedProducts, usersData as seedUsers } from '../data'
import { AdminDataContext } from './AdminContext'

// debounce localStorage writes per key to avoid churn/race conditions
const _writeTimers = new Map()
function debouncedSetItem(key, value) {
  if (typeof window === 'undefined') return
  if (_writeTimers.has(key)) clearTimeout(_writeTimers.get(key))
  const t = setTimeout(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore storage errors
    }
    _writeTimers.delete(key)
  }, 200)
  _writeTimers.set(key, t)
}

const STORAGE_KEYS = {
  users: 'admin-dashboard-users',
  products: 'admin-dashboard-products',
  activity: 'admin-dashboard-activity',
  deletedUsers: 'admin-dashboard-deleted-users',
  deletedProducts: 'admin-dashboard-deleted-products',
  settings: 'admin-dashboard-settings',
}

function buildInitialUsers() {
  if (typeof window === 'undefined') return seedUsers

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.users)
    return stored ? JSON.parse(stored) : seedUsers
  } catch {
    return seedUsers
  }
}

function buildInitialProducts() {
  if (typeof window === 'undefined') return seedProducts

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.products)
    return stored ? JSON.parse(stored) : seedProducts
  } catch {
    return seedProducts
  }
}

function getNextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1
}

function makeInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

function makeColor(seed = 0) {
  const palette = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316']
  return palette[seed % palette.length]
}

function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('en-US')}`
}

function parseMoney(value) {
  if (typeof value === 'number') return value
  return Number(String(value || '').replace(/[^0-9.-]/g, '')) || 0
}

function sumMoney(items, selector) {
  return items.reduce((total, item) => total + parseMoney(selector(item)), 0)
}

function buildInitialActivity() {
  if (typeof window === 'undefined') return seedActivity

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.activity)
    return stored ? JSON.parse(stored) : seedActivity
  } catch {
    return seedActivity
  }
}

function buildInitialDeletedUsers() {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.deletedUsers)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function buildInitialDeletedProducts() {
  if (typeof window === 'undefined') return []

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.deletedProducts)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function notificationsEnabled() {
  if (typeof window === 'undefined') return false

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.settings)
    if (!stored) return true

    const parsed = JSON.parse(stored)
    return parsed?.notifications !== false
  } catch {
    return true
  }
}

function sendBrowserNotification(text) {
  if (typeof window === 'undefined') return
  if (!('Notification' in window)) return
  if (window.Notification.permission !== 'granted') return

  new window.Notification('Nexa Metrics', {
    body: text,
    silent: false,
  })
}

export function AdminDataProvider({ children }) {
  const [users, setUsers] = useState(buildInitialUsers)
  const [products, setProducts] = useState(buildInitialProducts)
  const [activity, setActivity] = useState(buildInitialActivity)
  const [deletedUsers, setDeletedUsers] = useState(buildInitialDeletedUsers)
  const [deletedProducts, setDeletedProducts] = useState(buildInitialDeletedProducts)
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])

  useEffect(() => {
    debouncedSetItem(STORAGE_KEYS.users, users)
  }, [users])

  useEffect(() => {
    debouncedSetItem(STORAGE_KEYS.products, products)
  }, [products])

  useEffect(() => {
    debouncedSetItem(STORAGE_KEYS.activity, activity)
  }, [activity])

  useEffect(() => {
    debouncedSetItem(STORAGE_KEYS.deletedUsers, deletedUsers)
  }, [deletedUsers])

  useEffect(() => {
    debouncedSetItem(STORAGE_KEYS.deletedProducts, deletedProducts)
  }, [deletedProducts])

  const captureSnapshot = () => ({
    users,
    products,
    activity,
    deletedUsers,
    deletedProducts,
  })

  const pushHistory = () => {
    setHistory((current) => [captureSnapshot(), ...current].slice(0, 20))
    setFuture([])
  }

  const restoreSnapshot = (snapshot) => {
    setUsers(snapshot.users)
    setProducts(snapshot.products)
    setActivity(snapshot.activity)
    setDeletedUsers(snapshot.deletedUsers)
    setDeletedProducts(snapshot.deletedProducts)
  }

  const metrics = useMemo(() => {
    const totalUserMRR = sumMoney(users, (user) => user.mrr)
    const totalProductMRR = sumMoney(products, (product) => product.mrr)
    const totalTrackedRevenue = totalUserMRR + totalProductMRR
    const totalSubscribers = products.reduce((total, product) => total + Number(product.subscribers || 0), 0)
    const recycleBinCount = deletedUsers.length + deletedProducts.length

    return {
      activeUsers: users.filter((user) => user.status === 'active').length,
      trialUsers: users.filter((user) => user.status === 'trial').length,
      activeProducts: products.filter((product) => product.status !== 'archived').length,
      betaProducts: products.filter((product) => product.status === 'beta').length,
      totalUsers: users.length,
      totalProducts: products.length,
      totalSubscribers,
      totalUserMRR,
      totalProductMRR,
      totalTrackedRevenue,
      recycleBinCount,
    }
  }, [users, products, deletedUsers, deletedProducts])

  const recordActivity = (type, text) => {
    setActivity((current) => [
      {
        id: Date.now(),
        type,
        text,
        time: 'Just now',
      },
      ...current,
    ].slice(0, 20))

    if (notificationsEnabled()) {
      sendBrowserNotification(text)
    }
  }

  const addUser = (user) => {
    pushHistory()
    const name = user.name.trim()
    setUsers((current) => [
      {
        id: getNextId(current),
        initials: makeInitials(name),
        avatarColor: user.avatarColor || makeColor(current.length),
        ...user,
        name,
        mrr: formatMoney(user.mrr),
      },
      ...current,
    ])
    recordActivity('user', `Created user ${name}`)
  }

  const updateUser = (id, updates) => {
    pushHistory()
    setUsers((current) => {
      const next = current.map((user) =>
        user.id === id
          ? {
              ...user,
              ...updates,
              initials: updates.name ? makeInitials(updates.name) : user.initials,
              mrr: updates.mrr !== undefined ? formatMoney(updates.mrr) : user.mrr,
            }
          : user
      )

      const updated = next.find((user) => user.id === id)
      if (updated) recordActivity('user', `Updated user ${updated.name}`)

      return next
    })
  }

  const deleteUser = (id) => {
    pushHistory()
    setUsers((current) => {
      const target = current.find((user) => user.id === id)
      if (target) {
        setDeletedUsers((deletedCurrent) => [
          {
            ...target,
            deletedAt: Date.now(),
            deletedType: 'user',
          },
          ...deletedCurrent.filter((item) => item.id !== target.id),
        ])
        recordActivity('alert', `Moved user ${target.name} to recycle bin`)
      }

      return current.filter((user) => user.id !== id)
    })
  }

  const restoreUser = (id) => {
    pushHistory()
    setDeletedUsers((current) => {
      const target = current.find((item) => item.id === id)
      if (!target) return current

      setUsers((activeCurrent) => [
        {
          ...target,
          deletedAt: undefined,
          deletedType: undefined,
        },
        ...activeCurrent,
      ])
      recordActivity('data', `Restored user ${target.name}`)
      return current.filter((item) => item.id !== id)
    })
  }

  const purgeUser = (id) => {
    pushHistory()
    setDeletedUsers((current) => {
      const target = current.find((item) => item.id === id)
      if (target) recordActivity('alert', `Permanently deleted user ${target.name}`)
      return current.filter((item) => item.id !== id)
    })
  }

  const duplicateUser = (id) => {
    pushHistory()
    setUsers((current) => {
      const source = current.find((user) => user.id === id)
      if (!source) return current

      const copy = {
        ...source,
        id: getNextId(current),
        name: `${source.name} Copy`,
        email: `copy+${source.id}.${source.email}`,
        initials: makeInitials(`${source.name} Copy`),
        avatarColor: makeColor(current.length),
      }

      recordActivity('user', `Duplicated user ${source.name}`)

      return [copy, ...current]
    })
  }

  const addProduct = (product) => {
    pushHistory()
    const name = product.name.trim()
    setProducts((current) => [
      {
        id: getNextId(current),
        subscribers: Number(product.subscribers || 0),
        mrr: Number(product.mrr || 0),
        price: Number(product.price || 0),
        status: product.status || 'draft',
        team: product.team || 'Product',
        name,
        desc: product.desc,
        ...product,
      },
      ...current,
    ])
    recordActivity('data', `Created product ${name}`)
  }

  const updateProduct = (id, updates) => {
    pushHistory()
    setProducts((current) => {
      const next = current.map((product) =>
        product.id === id
          ? {
              ...product,
              ...updates,
              subscribers: updates.subscribers !== undefined ? Number(updates.subscribers) : product.subscribers,
              mrr: updates.mrr !== undefined ? Number(updates.mrr) : product.mrr,
              price: updates.price !== undefined ? Number(updates.price) : product.price,
            }
          : product
      )

      const updated = next.find((product) => product.id === id)
      if (updated) recordActivity('data', `Updated product ${updated.name}`)

      return next
    })
  }

  const deleteProduct = (id) => {
    pushHistory()
    setProducts((current) => {
      const target = current.find((product) => product.id === id)
      if (target) {
        setDeletedProducts((deletedCurrent) => [
          {
            ...target,
            deletedAt: Date.now(),
            deletedType: 'product',
          },
          ...deletedCurrent.filter((item) => item.id !== target.id),
        ])
        recordActivity('alert', `Moved product ${target.name} to recycle bin`)
      }

      return current.filter((product) => product.id !== id)
    })
  }

  const restoreProduct = (id) => {
    pushHistory()
    setDeletedProducts((current) => {
      const target = current.find((item) => item.id === id)
      if (!target) return current

      setProducts((activeCurrent) => [
        {
          ...target,
          deletedAt: undefined,
          deletedType: undefined,
        },
        ...activeCurrent,
      ])
      recordActivity('data', `Restored product ${target.name}`)
      return current.filter((item) => item.id !== id)
    })
  }

  const purgeProduct = (id) => {
    pushHistory()
    setDeletedProducts((current) => {
      const target = current.find((item) => item.id === id)
      if (target) recordActivity('alert', `Permanently deleted product ${target.name}`)
      return current.filter((item) => item.id !== id)
    })
  }

  const duplicateProduct = (id) => {
    pushHistory()
    setProducts((current) => {
      const source = current.find((product) => product.id === id)
      if (!source) return current

      const nextId = getNextId(current)
      const copy = {
        ...source,
        id: nextId,
        name: `${source.name} Copy`,
        subscribers: Number(source.subscribers || 0),
        mrr: Number(source.mrr || 0),
      }

      recordActivity('data', `Duplicated product ${source.name}`)

      return [copy, ...current]
    })
  }

  const clearActivity = () => {
    pushHistory()
    setActivity([])
  }

  const undo = () => {
    if (history.length === 0) return

    const [snapshot, ...rest] = history
    const currentSnapshot = captureSnapshot()
    setFuture((current) => [currentSnapshot, ...current].slice(0, 20))
    restoreSnapshot(snapshot)
    recordActivity('alert', 'Undid last change')
    setHistory(rest)
  }

  const redo = () => {
    if (future.length === 0) return

    const [snapshot, ...rest] = future
    const currentSnapshot = captureSnapshot()
    setHistory((current) => [currentSnapshot, ...current].slice(0, 20))
    restoreSnapshot(snapshot)
    recordActivity('data', 'Redid last change')
    setFuture(rest)
  }

  const value = {
    users,
    products,
    activity,
    deletedUsers,
    deletedProducts,
    metrics,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    addUser,
    updateUser,
    deleteUser,
    duplicateUser,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    restoreUser,
    purgeUser,
    restoreProduct,
    purgeProduct,
    undo,
    redo,
    recordActivity,
    clearActivity,
  }

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
}
