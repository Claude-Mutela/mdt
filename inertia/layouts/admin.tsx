import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import toast, { Toaster } from 'react-hot-toast'
import SettingsModal from '../components/SettingsModal'
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
  Coins,
  UserPlus,
  MailCheck,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',   href: '/admin',            icon: LayoutDashboard },
  { label: 'Utilisateurs',href: '/admin/users',      icon: UserCog },
  { label: 'Membres',     href: '/admin/membres',     icon: Users },
  { label: 'Nouveaux Venus', href: '/admin/nouveaux-venus', icon: UserPlus },
  { label: 'Agenda',      href: '/admin/agenda',      icon: CalendarDays },
  { label: 'Rendez-vous',  href: '/admin/rendez-vous', icon: CalendarDays },
  { label: 'Assets',      href: '/admin/assets',      icon: Image },
  { label: 'Ministères',  href: '/admin/ministeres',  icon: Church },
  { label: 'Cellules',    href: '/admin/cellules',    icon: Grid3X3 },
  { label: 'Événements',  href: '/admin/evenements',  icon: Ticket },
  { label: 'Médias',      href: '/admin/medias',      icon: PlayCircle },
  { label: 'Galerie',     href: '/admin/galerie',     icon: Image },
  { label: 'Dons',        href: '/admin/donations',   icon: HeartHandshake },
  { label: 'Finances',    href: '/admin/finances',    icon: Coins },
  { label: 'Newsletter',  href: '/admin/newsletter',  icon: MailCheck },
]

interface User {
  id: number
  fullName: string
  firstname?: string
  lastname?: string
  email: string
  role: 'superadmin' | 'admin' | 'pasteur' | 'user' | 'tresorier' | 'financier' | 'mdtcom' | 'administration' | 'porte_integration'
  initials: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title = 'Dashboard' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
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
    
    // Le superadmin et le pasteur ont accès à absolument tout
    if (user.role === 'superadmin' || user.role === 'pasteur') {
      return true
    }

    // L'admin a accès à tout sauf la gestion des utilisateurs
    if (user.role === 'admin') {
      return href !== '/admin/users'
    }

    // Trésorier ou Financier : seulement les finances et dons
    if (user.role === 'tresorier' || user.role === 'financier') {
      const allowed = ['/admin/donations', '/admin/finances']
      return allowed.includes(href)
    }

    // MDTCom : seulement assets, galeries, media, agenda, cellules, ministères, événements, newsletter
    if (user.role === 'mdtcom') {
      const allowed = [
        '/admin/assets',
        '/admin/galerie',
        '/admin/medias',
        '/admin/agenda',
        '/admin/cellules',
        '/admin/ministeres',
        '/admin/evenements',
        '/admin/newsletter',
      ]
      return allowed.includes(href)
    }

    // Administration : seulement nouveaux venus, membres, rendez-vous
    if (user.role === 'administration') {
      const allowed = ['/admin/nouveaux-venus', '/admin/membres', '/admin/rendez-vous']
      return allowed.includes(href)
    }

    // Porte intégration : seulement nouveaux venus
    if (user.role === 'porte_integration') {
      const allowed = ['/admin/nouveaux-venus']
      return allowed.includes(href)
    }

    // Rôle "user" standard (hérité/fallback)
    if (user.role === 'user') {
      const allowed = ['/admin/membres', '/admin/nouveaux-venus', '/admin/ministeres', '/admin/cellules', '/admin/donations']
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
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-3 border-l border-slate-700 hover:opacity-80 transition-opacity text-left focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-black text-white shadow-lg shadow-primary/20">
                  {user?.initials || '??'}
                </div>
                <div className="text-xs hidden sm:block">
                  <p className="text-white font-bold leading-none mb-0.5">
                    {user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : (user?.fullName || 'Utilisateur')}
                  </p>
                  <p className="text-slate-500 uppercase text-[9px] tracking-widest font-black">
                    {user?.role === 'superadmin' && 'Super Administrateur'}
                    {user?.role === 'admin' && 'Administrateur'}
                    {user?.role === 'pasteur' && 'Pasteur'}
                    {user?.role === 'tresorier' && 'Trésorier'}
                    {user?.role === 'financier' && 'Financier'}
                    {user?.role === 'mdtcom' && 'Communication MDT'}
                    {user?.role === 'administration' && 'Administration'}
                    {user?.role === 'porte_integration' && 'Porte d\'Intégration'}
                    {user?.role === 'user' && 'Utilisateur'}
                    {!['superadmin', 'admin', 'pasteur', 'tresorier', 'financier', 'mdtcom', 'administration', 'porte_integration', 'user'].includes(user?.role || '') && (user?.role || 'Inconnu')}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        setSettingsOpen(true)
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <UserCog size={16} />
                      <span>Mon Profil</span>
                    </button>
                    <Link
                      href="/logout"
                      method="post"
                      as="button"
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors border-t border-slate-800/50 mt-1"
                    >
                      <LogOut size={16} />
                      <span>Déconnexion</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        user={user} 
      />
    </div>
  )
}
