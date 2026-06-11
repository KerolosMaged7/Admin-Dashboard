export const kpiData = [
  {
    id: 1,
    label: 'Monthly Revenue',
    value: '$84,320',
    change: '+12.4%',
    up: true,
    icon: 'DollarSign',
    color: 'indigo',
  },
  {
    id: 2,
    label: 'Active Users',
    value: '14,872',
    change: '+8.1%',
    up: true,
    icon: 'Users',
    color: 'emerald',
  },
  {
    id: 3,
    label: 'Churn Rate',
    value: '2.3%',
    change: '-0.4%',
    up: false,
    icon: 'RefreshCw',
    color: 'cyan',
  },
  {
    id: 4,
    label: 'New Sign-ups',
    value: '1,204',
    change: '+3.7%',
    up: true,
    icon: 'Rocket',
    color: 'amber',
  },
]

export const revenueData = [
  { month: 'Jan', mrr: 52000, target: 55000 },
  { month: 'Feb', mrr: 58000, target: 60000 },
  { month: 'Mar', mrr: 61000, target: 64000 },
  { month: 'Apr', mrr: 65000, target: 68000 },
  { month: 'May', mrr: 68000, target: 70000 },
  { month: 'Jun', mrr: 72000, target: 74000 },
  { month: 'Jul', mrr: 69000, target: 74000 },
  { month: 'Aug', mrr: 75000, target: 78000 },
  { month: 'Sep', mrr: 79000, target: 82000 },
  { month: 'Oct', mrr: 82000, target: 85000 },
  { month: 'Nov', mrr: 91000, target: 88000 },
  { month: 'Dec', mrr: 84320, target: 92000 },
]

export const planData = [
  { name: 'Enterprise', value: 38, color: '#6366f1' },
  { name: 'Pro',        value: 29, color: '#8b5cf6' },
  { name: 'Starter',    value: 20, color: '#06b6d4' },
  { name: 'Trial',      value: 13, color: '#c7d2fe' },
]

export const usersData = [
  { id: 1, name: 'Jordan Chen',   email: 'jordan@vortex.io',   initials: 'JC', avatarColor: '#6366f1', plan: 'Enterprise', mrr: '$2,400', status: 'active' },
  { id: 2, name: 'Maria Patel',   email: 'm.patel@lumio.com',  initials: 'MP', avatarColor: '#10b981', plan: 'Pro',        mrr: '$490',   status: 'active' },
  { id: 3, name: 'Ryan Kowalski', email: 'ryan@synapse.dev',   initials: 'RK', avatarColor: '#f59e0b', plan: 'Starter',   mrr: '$79',    status: 'trial'  },
  { id: 4, name: 'Sofia Laurent', email: 's.laurent@arc.co',   initials: 'SL', avatarColor: '#8b5cf6', plan: 'Enterprise', mrr: '$3,200', status: 'active' },
  { id: 5, name: 'Tom Becker',    email: 't.becker@helix.ai',  initials: 'TB', avatarColor: '#06b6d4', plan: 'Pro',        mrr: '$490',   status: 'inactive'},
]

export const productData = [
  {
    id: 1,
    name: 'Enterprise Suite',
    desc: 'Full enterprise offering with SSO and SLA',
    status: 'active',
    subscribers: 1240,
    mrr: 48200,
    price: 249,
    team: 'Platform',
  },
  {
    id: 2,
    name: 'CRM Platform',
    desc: 'Customer management and pipeline tools',
    status: 'active',
    subscribers: 960,
    mrr: 21600,
    price: 79,
    team: 'Revenue',
  },
  {
    id: 3,
    name: 'Analytics API',
    desc: 'Data APIs and reporting services',
    status: 'beta',
    subscribers: 420,
    mrr: 9800,
    price: 49,
    team: 'Data',
  },
  {
    id: 4,
    name: 'Marketing AI',
    desc: 'Automation tools for campaigns',
    status: 'active',
    subscribers: 640,
    mrr: 15200,
    price: 89,
    team: 'Growth',
  },
]

export const activityData = [
  { id: 1, type: 'upgrade',  text: 'Acme Corp upgraded to Enterprise',           time: '2 min ago'  },
  { id: 2, type: 'payment',  text: '$3,200 payment received from Arc Co.',        time: '14 min ago' },
  { id: 3, type: 'user',     text: 'New sign-up: lena@nova.ai started a trial',  time: '31 min ago' },
  { id: 4, type: 'alert',    text: 'Helix AI account flagged as inactive',        time: '1 hr ago'   },
  { id: 5, type: 'data',     text: 'Data export completed for Vortex Inc.',       time: '2 hr ago'   },
  { id: 6, type: 'payment',  text: '$490 payment received from Lumio',            time: '3 hr ago'   },
]

export const navItems = [
  { label: 'Dashboard',  icon: 'LayoutDashboard', active: true  },
  { label: 'Analytics',  icon: 'BarChart2',        active: false },
  { label: 'Users',      icon: 'Users',            active: false },
  { label: 'Revenue',    icon: 'CreditCard',       active: false },
  { label: 'Products',   icon: 'Package',          active: false },
  { label: 'Audit Log',  icon: 'ScrollText',       active: false },
]
