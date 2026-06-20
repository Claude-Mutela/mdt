import { Head, useForm } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Plus, Search, Filter, Pencil, Trash2, X, Check, ShieldCheck } from 'lucide-react'

type Role = 'admin' | 'superadmin' | 'user' | 'pasteur' | 'tresorier' | 'financier' | 'mdtcom' | 'administration' | 'porte_integration'
type Statut = 'actif' | 'inactif' | 'suspendu'

interface Utilisateur {
  id: number
  firstname: string
  lastname: string
  email: string
  role: Role
  status: Statut
}

interface UsersProps {
  users: {
    meta: any
    links: any[]
    data: Utilisateur[]
  }
}

const ROLES = ['Tous', 'admin', 'user', 'pasteur', 'superadmin', 'tresorier', 'financier', 'mdtcom', 'administration', 'porte_integration']
const STATUTS = ['Tous', 'actif', 'inactif', 'suspendu']

export default function AdminUsers({ users }: UsersProps) {
  const [search, setSearch]         = useState('')
  const [filtreRole, setFiltreRole] = useState('Tous')
  const [filtreStatut, setFiltreStatut] = useState('Tous')
  const [modal, setModal]           = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected]     = useState<Utilisateur | null>(null)

  const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user' as Role,
    status: 'actif' as Statut
  })

  const usersList = users.data || []

  const filtered = usersList.filter((u) => {
    const fullName = `${u.firstname || ''} ${u.lastname || ''}`.toLowerCase()
    const matchSearch  = fullName.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole    = filtreRole === 'Tous'   || u.role === filtreRole
    const matchStatut  = filtreStatut === 'Tous' || u.status === filtreStatut
    return matchSearch && matchRole && matchStatut
  })

  function openAdd() { 
    clearErrors()
    reset()
    setModal('add') 
  }
  
  function openEdit(u: Utilisateur) { 
    clearErrors()
    setSelected(u)
    setData({
      firstname: u.firstname || '',
      lastname: u.lastname || '',
      email: u.email || '',
      password: '', // Laisser vide pour ne pas le modifier
      role: u.role,
      status: u.status
    })
    setModal('edit') 
  }
  
  function openDelete(u: Utilisateur) { 
    setSelected(u)
    setModal('delete') 
  }
  
  function closeModal() { 
    setModal(null)
    setSelected(null) 
    reset()
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') {
      post('/admin/users', {
        onSuccess: () => closeModal(),
      })
    } else if (modal === 'edit' && selected) {
      put(`/admin/users/${selected.id}`, {
        onSuccess: () => closeModal(),
      })
    }
  }

  function handleDelete() {
    if (selected) {
      destroy(`/admin/users/${selected.id}`, {
        onSuccess: () => closeModal(),
      })
    }
  }

  // Helpers pour l'affichage
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
      case 'pasteur': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      case 'superadmin': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
      case 'tresorier': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'financier': return 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
      case 'mdtcom': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
      case 'administration': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
      case 'porte_integration': return 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
      case 'user': return 'bg-slate-700 text-slate-300 border border-slate-600'
      default: return 'bg-slate-700 text-slate-300 border border-slate-600'
    }
  }

  const getStatutBadge = (statut: Statut) => {
    switch (statut) {
      case 'actif': return 'bg-green-500/10 text-green-400 border border-green-500/20'
      case 'inactif': return 'bg-slate-700 text-slate-400 border border-slate-600'
      case 'suspendu': return 'bg-red-500/10 text-red-400 border border-red-500/20'
      default: return 'bg-slate-700 text-slate-400 border border-slate-600'
    }
  }

  return (
    <>
      <Head title="Utilisateurs — Admin Phila MDT" />
      <AdminLayout title="Gestion des utilisateurs">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un utilisateur…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-slate-400" />
            <select
              value={filtreRole} onChange={(e) => setFiltreRole(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary capitalize"
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select
              value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-primary capitalize"
            >
              {STATUTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* ── Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-white font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Comptes Utilisateurs <span className="text-slate-400 font-normal text-sm">({filtered.length})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  {['Utilisateur', 'Email', 'Rôle', 'Statut'].map((h) => (
                    <th key={h} className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                  <th className="text-left text-slate-400 font-medium px-6 py-3 text-xs uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0 uppercase">
                          {(u.firstname?.[0] || '')}{(u.lastname?.[0] || '')}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-medium whitespace-nowrap">{u.firstname} {u.lastname}</span>
                          {/* Optionnel : afficher le full_name s'il est différent ou utile */}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${getStatutBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => openDelete(u)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination meta={users.meta} links={users.links} />
        </div>

        {/* ── Modal Add/Edit ── */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <form onSubmit={handleSave}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                  <h3 className="text-white font-bold text-lg">{modal === 'add' ? 'Nouvel utilisateur' : 'Modifier l\'utilisateur'}</h3>
                  <button type="button" onClick={closeModal} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Prénom</label>
                      <input
                        value={data.firstname}
                        onChange={(e) => setData('firstname', e.target.value)}
                        placeholder="Ex: Jean"
                        className="w-full mt-1.5 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                        required
                      />
                      {errors.firstname && <span className="text-red-500 text-xs mt-1 block">{errors.firstname}</span>}
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Nom</label>
                      <input
                        value={data.lastname}
                        onChange={(e) => setData('lastname', e.target.value)}
                        placeholder="Ex: Dupont"
                        className="w-full mt-1.5 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                        required
                      />
                      {errors.lastname && <span className="text-red-500 text-xs mt-1 block">{errors.lastname}</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="jean.dupont@mdt.cd"
                      className="w-full mt-1.5 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      required
                    />
                    {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Mot de passe {modal === 'edit' && <span className="text-slate-500 font-normal lowercase">(laisser vide pour ne pas modifier)</span>}
                    </label>
                    <input
                      type="password"
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full mt-1.5 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                      required={modal === 'add'}
                      minLength={6}
                    />
                    {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Rôle</label>
                      <select 
                        value={data.role} 
                        onChange={(e) => setData('role', e.target.value as Role)}
                        className="w-full mt-1.5 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors capitalize"
                      >
                        {ROLES.filter(r => r !== 'Tous').map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Statut</label>
                      <select 
                        value={data.status} 
                        onChange={(e) => setData('status', e.target.value as Statut)}
                        className="w-full mt-1.5 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-primary transition-colors capitalize"
                      >
                        {STATUTS.filter(s => s !== 'Tous').map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-800/20">
                  <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Annuler</button>
                  <button type="submit" disabled={processing} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors shadow-lg shadow-primary/20 disabled:opacity-50">
                    <Check size={16} /> {processing ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal Delete ── */}
        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-xl">Supprimer l'utilisateur</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer <strong className="text-white">{selected.firstname} {selected.lastname}</strong> ?<br/>Cette action est irréversible.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors">Annuler</button>
                <button onClick={handleDelete} disabled={processing} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50">
                  {processing ? 'Suppression...' : 'Oui, supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
