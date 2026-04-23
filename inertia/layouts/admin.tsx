import { useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Church,
  Ticket,
  PlayCircle,
  Image,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',   href: '/admin',            icon: LayoutDashboard },
  { label: 'Membres',     href: '/admin/membres',     icon: Users },
  { label: 'Agenda',      href: '/admin/agenda',      icon: CalendarDays },
  { label: 'Ministères',  href: '/admin/ministeres',  icon: Church },
  { label: 'Événements',  href: '/admin/evenements',  icon: Ticket },
  { label: 'Médias',      href: '/admin/medias',      icon: PlayCircle },
  { label: 'Galerie',     href: '/admin/galerie',     icon: Image },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { url } = usePage()

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`flex flex-col shrink-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">P</span>
          </div>
          {sidebarOpen && (
            <span className="font-black text-white tracking-tight leading-tight text-sm">
              Phila MDT<br />
              <span className="text-slate-400 font-normal text-xs">Administration</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = url === href || (href !== '/admin' && url.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{label}</span>}
                {sidebarOpen && active && (
                  <ChevronRight size={14} className="ml-auto text-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="border-t border-slate-800 p-3">
          <Link
            href="/logout"
            method="post"
            as="button"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </Link>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-base font-bold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-700">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold">
                A
              </div>
              <div className="text-xs">
                <p className="text-white font-medium">Admin</p>
                <p className="text-slate-400">Phila MDT</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
