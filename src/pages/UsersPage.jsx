import { useMemo, useState } from 'react'
import { usersData } from '../data'

export default function UsersPage() {
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    return usersData.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="bg-[#14162A] p-6 rounded-2xl border border-white/10">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Users Management</h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-2 outline-none"
        />
      </div>

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="flex justify-between items-center bg-white/5 rounded-xl p-4">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-white/50">{user.email}</p>
            </div>
            <span className="text-sm px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300">
              {user.plan}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
