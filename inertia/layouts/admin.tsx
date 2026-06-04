import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import toast, { Toaster } from 'react-hot-toast'
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
  HeartHandshake,
  UserCog,
  Grid3X3,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',   href: '/admin',            icon: LayoutDashboard },
  { label: 'Utilisateurs',href: '/admin/users',      icon: UserCog },
  { label: 'Membres',     href: '/admin/membres',     icon: Users },
  { label: 'Agenda',      href: '/admin/agenda',      icon: CalendarDays },
  { label: 'Rendez-vous',  href: '/admin/rendez-vous', icon: CalendarDays },
  { label: 'Assets',      href: '/admin/assets',      icon: Image },
  { label: 'Ministères',  href: '/admin/ministeres',  icon: Church },
  { label: 'Cellules',    href: '/admin/cellules',    icon: Grid3X3 },
  { label: 'Événements',  href: '/admin/evenements',  icon: Ticket },
  { label: 'Médias',      href: '/admin/medias',      icon: PlayCircle },
  { label: 'Galerie',     href: '/admin/galerie',     icon: Image },
  { label: 'Dons',        href: '/admin/donations',   icon: HeartHandshake },
]

interface User {
  id: number
  fullName: string
  email: string
  role: 'superadmin' | 'admin' | 'pasteur' | 'user'
  initials: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { url, props } = usePage()
  const flash = props.flash as { success?: string, error?: string }
  const user = props.user as User

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  // Fonction pour vérifier si l'utilisateur peut voir un item de navigation
  const canAccess = (href: string) => {
    if (!user) return false
    if (user.role === 'superadmin') return true

    if (user.role === 'admin' || user.role === 'pasteur') {
      return href !== '/admin/users' // Voit tout sauf Utilisateurs
    }

    if (user.role === 'user') {
      // Voit seulement Dashboard, Membres, Ministères, Cellules et Dons
      const allowed = ['/admin', '/admin/membres', '/admin/ministeres', '/admin/cellules', '/admin/donations']
      return allowed.includes(href)
    }

    return false
  }

  const filteredNavItems = navItems.filter(item => canAccess(item.href))

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden font-sans">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155'
          },
        }}
      />
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside
        className={`flex flex-col shrink-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
          <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 p-1">
            <img src="/MDT LOGO ORANGE.png" alt="Phila MDT" className="w-full h-full object-contain drop-shadow-md" />
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
          {filteredNavItems.map(({ label, href, icon: Icon }) => {
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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-black text-white shadow-lg shadow-primary/20">
                {user?.initials || '??'}
              </div>
              <div className="text-xs">
                <p className="text-white font-bold leading-none mb-0.5">{user?.fullName || 'Utilisateur'}</p>
                <p className="text-slate-500 uppercase text-[9px] tracking-widest font-black">{user?.role || 'Inconnu'}</p>
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
