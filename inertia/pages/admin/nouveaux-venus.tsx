import { Head, router, useForm } from '@inertiajs/react'
import { useState, useEffect, useRef, useMemo } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X, 
  Search, 
  Printer, 
  UserPlus,
  Check,
  User,
  HeartPulse,
  Sparkles,
  MapPin
} from 'lucide-react'

interface Newcomer {
  id: number
  date: string
  lastname: string
  firstname: string
  gender: 'M' | 'F'
  phone: string | null
  email: string | null
  profession: string | null
  maritalStatus: string | null
  city: string | null
  address: string | null
  heardAbout: string
  comeBack: boolean
  baptized: boolean
  spiritualFollowup: boolean
  receiveJesus: boolean
  joinCell: boolean
  serve: boolean
  suggestions: string | null
  createdAt: string
}

interface Props {
  newcomers: {
    data: Newcomer[]
    meta: any
  }
  availableYears: number[]
  filters: {
    search: string | null
    month: string | null
    year: string | null
  }
}

const MONTHS = [
  { value: '1', label: 'Janvier' },
  { value: '2', label: 'Février' },
  { value: '3', label: 'Mars' },
  { value: '4', label: 'Avril' },
  { value: '5', label: 'Mai' },
  { value: '6', label: 'Juin' },
  { value: '7', label: 'Juillet' },
  { value: '8', label: 'Août' },
  { value: '9', label: 'Septembre' },
  { value: '10', label: 'Octobre' },
  { value: '11', label: 'Novembre' },
  { value: '12', label: 'Décembre' }
]

const HEARD_ABOUT_OPTIONS = [
  { value: 'invitation', label: 'Invitation par un proche' },
  { value: 'evangelisation', label: 'Action d’évangélisation' },
  { value: 'reseaux_sociaux', label: 'Réseaux sociaux' },
  { value: 'famille_philadelphie', label: 'Famille Philadelphie' },
  { value: 'autre', label: 'Autre' }
]

export default function AdminNewcomers({ newcomers, availableYears, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '')
  const [month, setMonth] = useState(filters.month || '')
  const [year, setYear] = useState(filters.year || '')
  const isMounted = useRef(false)

  // États pour la modale d'impression
  const [printModalOpen, setPrintModalOpen] = useState(false)
  const [printPeriodType, setPrintPeriodType] = useState<'all' | 'year' | 'month-year'>('all')
  const currentYear = new Date().getFullYear()
  const [printYear, setPrintYear] = useState<number>(availableYears[0] ?? currentYear)
  const [printMonth, setPrintMonth] = useState<number | string>('') // '' = tous les mois

  // Mois disponibles pour l'année d'impression sélectionnée
  const printAvailableMonths = useMemo(() => {
    const months = new Set(
      newcomers.data
        .filter(n => {
          const dateY = new Date(n.date).getFullYear()
          return dateY === printYear
        })
        .map(n => new Date(n.date).getMonth() + 1)
    )
    return Array.from(months).sort((a, b) => a - b)
  }, [newcomers.data, printYear])

  // Vider le mois quand l'année change
  useEffect(() => {
    setPrintMonth('')
  }, [printYear])

  // Auto-filtering with debounce
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const timeoutId = setTimeout(() => {
      router.get('/admin/nouveaux-venus', { search, month, year }, {
        preserveState: true,
        replace: true,
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, month, year])

  // Modals State
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selectedNewcomer, setSelectedNewcomer] = useState<Newcomer | null>(null)

  // Form setup
  const form = useForm({
    date: new Date().toISOString().split('T')[0],
    lastname: '',
    firstname: '',
    gender: 'M' as 'M' | 'F',
    phone: '',
    email: '',
    profession: '',
    maritalStatus: 'célibataire',
    city: 'Kinshasa',
    address: '',
    heardAbout: 'invitation',
    comeBack: false,
    baptized: false,
    spiritualFollowup: false,
    receiveJesus: false,
    joinCell: false,
    serve: false,
    suggestions: ''
  })

  const handleReset = () => {
    setSearch('')
    setMonth('')
    setYear('')
  }

  function openAdd() {
    form.reset()
    form.clearErrors()
    form.setData({
      date: new Date().toISOString().split('T')[0],
      lastname: '',
      firstname: '',
      gender: 'M',
      phone: '',
      email: '',
      profession: '',
      maritalStatus: 'célibataire',
      city: 'Kinshasa',
      address: '',
      heardAbout: 'invitation',
      comeBack: false,
      baptized: false,
      spiritualFollowup: false,
      receiveJesus: false,
      joinCell: false,
      serve: false,
      suggestions: ''
    })
    setSelectedNewcomer(null)
    setModal('add')
  }

  function openEdit(nv: Newcomer) {
    form.reset()
    form.clearErrors()
    form.setData({
      date: nv.date ? nv.date.split('T')[0] : new Date().toISOString().split('T')[0],
      lastname: nv.lastname,
      firstname: nv.firstname,
      gender: nv.gender,
      phone: nv.phone || '',
      email: nv.email || '',
      profession: nv.profession || '',
      maritalStatus: nv.maritalStatus || 'célibataire',
      city: nv.city || 'Kinshasa',
      address: nv.address || '',
      heardAbout: nv.heardAbout,
      comeBack: !!nv.comeBack,
      baptized: !!nv.baptized,
      spiritualFollowup: !!nv.spiritualFollowup,
      receiveJesus: !!nv.receiveJesus,
      joinCell: !!nv.joinCell,
      serve: !!nv.serve,
      suggestions: nv.suggestions || ''
    })
    setSelectedNewcomer(nv)
    setModal('edit')
  }

  function openDelete(nv: Newcomer) {
    setSelectedNewcomer(nv)
    setModal('delete')
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') {
      form.post('/admin/newcomers', {
        onSuccess: () => setModal(null)
      })
    } else if (modal === 'edit' && selectedNewcomer) {
      form.put(`/admin/newcomers/${selectedNewcomer.id}`, {
        onSuccess: () => setModal(null)
      })
    }
  }

  function handleDelete() {
    if (selectedNewcomer) {
      router.delete(`/admin/newcomers/${selectedNewcomer.id}`, {
        onSuccess: () => setModal(null)
      })
    }
  }

  const handlePrint = () => {
    setPrintModalOpen(true)
  }

  const launchPrint = () => {
    setPrintModalOpen(false)
    let url = '/admin/nouveaux-venus/print'
    const params = new URLSearchParams()
    
    // Garde la recherche en cours si présente
    if (search) params.append('search', search)
    
    if (printPeriodType === 'year') {
      params.append('year', String(printYear))
    } else if (printPeriodType === 'month-year') {
      params.append('year', String(printYear))
      if (printMonth !== '') {
        params.append('month', String(printMonth))
      }
    }
    
    const queryStr = params.toString()
    if (queryStr) {
      url += `?${queryStr}`
    }
    window.open(url, '_blank')
  }

  const getHeardAboutLabel = (value: string) => {
    return HEARD_ABOUT_OPTIONS.find(opt => opt.value === value)?.label || value
  }

  return (
    <>
      <Head title="Nouveaux Venus — Administration Phila MDT" />

      <AdminLayout title="Gestion des Nouveaux Venus">
        
        {/* En-tête de page & Filtres */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-end gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {/* Barre de recherche */}
            <div className="relative min-w-[240px] flex-1 sm:flex-initial">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
              <input
                type="text"
                placeholder="Rechercher un nouveau..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Filtre par Mois */}
            <select
              value={month}
              onChange={e => setMonth(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">Tous les mois</option>
              {MONTHS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            {/* Filtre par Année */}
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="">Toutes les années</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>

            {/* Réinitialiser */}
            {(search || month || year) && (
              <button
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold transition-all hover:bg-slate-800"
                title="Vider les filtres"
              >
                Vider
              </button>
            )}

            {/* Bouton Imprimer */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors border border-slate-700 shadow-lg cursor-pointer"
            >
              <Printer size={13} />
              Imprimer
            </button>

            {/* Ajouter un Nouveau Venu */}
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-primary/10 cursor-pointer"
            >
              <Plus size={14} />
              Ajouter un nouveau venu
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-850 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">Date d'arrivée</th>
                  <th className="px-6 py-4">Nom Complet</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Profession / État civil</th>
                  <th className="px-6 py-4">Comment connu</th>
                  <th className="px-6 py-4">Décisions & Intégration</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {newcomers.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 italic">
                      Aucun nouveau venu trouvé pour les critères de recherche.
                    </td>
                  </tr>
                ) : (
                  newcomers.data.map(nv => (
                    <tr key={nv.id} className="hover:bg-slate-800/10 transition-colors group">
                      <td className="px-6 py-4 text-slate-400 font-medium whitespace-nowrap">
                        {new Date(nv.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                        {nv.lastname} {nv.firstname}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          nv.gender === 'M' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'
                        }`}>
                          {nv.gender === 'M' ? 'Homme' : 'Femme'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-300">{nv.phone || '—'}</div>
                        <div className="text-slate-500 text-[10px]">{nv.email || ''}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-300 capitalize">{nv.profession || '—'}</div>
                        <div className="text-slate-500 text-[10px] capitalize">{nv.maritalStatus || '—'}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-medium max-w-[150px] truncate" title={getHeardAboutLabel(nv.heardAbout)}>
                        {getHeardAboutLabel(nv.heardAbout)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {nv.baptized && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Baptisé</span>}
                          {nv.spiritualFollowup && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Suivi Sp.</span>}
                          {nv.receiveJesus && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Reçu Jésus</span>}
                          {nv.joinCell && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Cellule</span>}
                          {nv.serve && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Servir</span>}
                          {nv.comeBack && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-pink-500/10 text-pink-400 border border-pink-500/20">Revient</span>}
                          {!nv.baptized && !nv.spiritualFollowup && !nv.receiveJesus && !nv.joinCell && !nv.serve && !nv.comeBack && (
                            <span className="text-slate-600 italic text-[10px]">Aucune décision</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEdit(nv)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                            title="Modifier"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => openDelete(nv)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination meta={newcomers.meta} />
        </div>

        {/* MODALE : AJOUT OU EDITION */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fade-in">
              
              {/* En-tête Modale */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {modal === 'add' ? 'Ajouter un nouveau venu' : 'Modifier la fiche de nouveau venu'}
                    </h3>
                    <p className="text-slate-400 text-[10px]">Renseignez les informations de la personne</p>
                  </div>
                </div>
                <button onClick={() => setModal(null)} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Formulaire */}
              <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* SECTION 1 : Infos personnelles */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-2 border-b border-slate-800 pb-1.5">
                    <User size={13} />
                    Informations Personnelles
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Date d'arrivée <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        value={form.data.date}
                        onChange={e => form.setData('date', e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.date && <p className="text-red-400 text-[10px] mt-1">{form.errors.date}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nom <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={form.data.lastname}
                        onChange={e => form.setData('lastname', e.target.value)}
                        placeholder="Ex: KABANGA"
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.lastname && <p className="text-red-400 text-[10px] mt-1">{form.errors.lastname}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Prénom <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={form.data.firstname}
                        onChange={e => form.setData('firstname', e.target.value)}
                        placeholder="Ex: Jonathan"
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.firstname && <p className="text-red-400 text-[10px] mt-1">{form.errors.firstname}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sexe <span className="text-red-500">*</span></label>
                      <select
                        value={form.data.gender}
                        onChange={e => form.setData('gender', e.target.value as any)}
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-bold"
                      >
                        <option value="M">Homme</option>
                        <option value="F">Femme</option>
                      </select>
                      {form.errors.gender && <p className="text-red-400 text-[10px] mt-1">{form.errors.gender}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Profession</label>
                      <input
                        type="text"
                        value={form.data.profession}
                        onChange={e => form.setData('profession', e.target.value)}
                        placeholder="Ex: Informaticien, Étudiant..."
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.profession && <p className="text-red-400 text-[10px] mt-1">{form.errors.profession}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">État civil</label>
                      <select
                        value={form.data.maritalStatus}
                        onChange={e => form.setData('maritalStatus', e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer font-bold"
                      >
                        <option value="célibataire">Célibataire</option>
                        <option value="marié">Marié(e)</option>
                        <option value="fiancé">Fiancé(e)</option>
                        <option value="veuf">Veuf/Veuve</option>
                        <option value="divorcé">Divorcé(e)</option>
                      </select>
                      {form.errors.maritalStatus && <p className="text-red-400 text-[10px] mt-1">{form.errors.maritalStatus}</p>}
                    </div>
                  </div>
                </div>

                {/* SECTION 2 : Coordonnées */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-2 border-b border-slate-800 pb-1.5">
                    <MapPin size={13} />
                    Coordonnées & Contact
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Téléphone</label>
                      <input
                        type="tel"
                        value={form.data.phone}
                        onChange={e => form.setData('phone', e.target.value)}
                        placeholder="Ex: 0812345678"
                        maxLength={10}
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.phone && <p className="text-red-400 text-[10px] mt-1">{form.errors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Email</label>
                      <input
                        type="email"
                        value={form.data.email}
                        onChange={e => form.setData('email', e.target.value)}
                        placeholder="Ex: contact@domaine.com"
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.email && <p className="text-red-400 text-[10px] mt-1">{form.errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ville</label>
                      <input
                        type="text"
                        value={form.data.city}
                        onChange={e => form.setData('city', e.target.value)}
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.city && <p className="text-red-400 text-[10px] mt-1">{form.errors.city}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Adresse</label>
                      <input
                        type="text"
                        value={form.data.address}
                        onChange={e => form.setData('address', e.target.value)}
                        placeholder="N° Avenue, Quartier, Commune..."
                        className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                      {form.errors.address && <p className="text-red-400 text-[10px] mt-1">{form.errors.address}</p>}
                    </div>
                  </div>
                </div>

                {/* SECTION 3 : Intégration spirituelle */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-2 border-b border-slate-800 pb-1.5">
                    <HeartPulse size={13} />
                    Suivi Spirituel & Intégration
                  </h4>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Comment avez-vous connu l'église ?</label>
                    <select
                      value={form.data.heardAbout}
                      onChange={e => form.setData('heardAbout', e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer font-bold"
                    >
                      {HEARD_ABOUT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {form.errors.heardAbout && <p className="text-red-400 text-[10px] mt-1">{form.errors.heardAbout}</p>}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-950 p-4 border border-slate-850 rounded-2xl">
                    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={form.data.baptized}
                        onChange={e => form.setData('baptized', e.target.checked)}
                        className="w-4 h-4 accent-primary rounded bg-slate-850 border-slate-750 focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <span className="text-slate-300 text-xs font-semibold">Baptisé(e)</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={form.data.spiritualFollowup}
                        onChange={e => form.setData('spiritualFollowup', e.target.checked)}
                        className="w-4 h-4 accent-primary rounded bg-slate-850 border-slate-750 focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <span className="text-slate-300 text-xs font-semibold">Suivi spirituel</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={form.data.receiveJesus}
                        onChange={e => form.setData('receiveJesus', e.target.checked)}
                        className="w-4 h-4 accent-primary rounded bg-slate-850 border-slate-750 focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <span className="text-slate-300 text-xs font-semibold">Recevoir Jésus</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={form.data.joinCell}
                        onChange={e => form.setData('joinCell', e.target.checked)}
                        className="w-4 h-4 accent-primary rounded bg-slate-850 border-slate-750 focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <span className="text-slate-300 text-xs font-semibold">Participer cellule</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={form.data.serve}
                        onChange={e => form.setData('serve', e.target.checked)}
                        className="w-4 h-4 accent-primary rounded bg-slate-850 border-slate-750 focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <span className="text-slate-300 text-xs font-semibold">Servir à l'église</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                      <input
                        type="checkbox"
                        checked={form.data.comeBack}
                        onChange={e => form.setData('comeBack', e.target.checked)}
                        className="w-4 h-4 accent-primary rounded bg-slate-850 border-slate-750 focus:ring-0 focus:outline-none cursor-pointer"
                      />
                      <span className="text-slate-300 text-xs font-semibold">Revenir prochainement</span>
                    </label>
                  </div>
                </div>

                {/* SECTION 4 : Suggestions */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary flex items-center gap-2 border-b border-slate-800 pb-1.5">
                    <Sparkles size={13} />
                    Suggestions & Remarques
                  </h4>

                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Suggestions</label>
                    <textarea
                      value={form.data.suggestions}
                      onChange={e => form.setData('suggestions', e.target.value)}
                      placeholder="Commentaires, remarques ou besoins spécifiques exprimés..."
                      rows={3}
                      className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary resize-none"
                    />
                    {form.errors.suggestions && <p className="text-red-400 text-[10px] mt-1">{form.errors.suggestions}</p>}
                  </div>
                </div>

              </form>

              {/* Pied de Page Modale */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors border border-slate-750 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={submit}
                  disabled={form.processing}
                  className="px-5 py-2.5 rounded-xl text-xs bg-primary hover:bg-primary/90 text-white font-bold transition-colors shadow-md shadow-primary/15 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Check size={14} />
                  Enregistrer
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MODALE : SUPPRESSION */}
        {modal === 'delete' && selectedNewcomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Supprimer le nouveau venu ?</h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Voulez-vous vraiment retirer la fiche de <strong>{selectedNewcomer.firstname} {selectedNewcomer.lastname}</strong> ? cette action est irréversible.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                <button
                  onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-750 text-white font-bold transition-colors border border-slate-750 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-xl text-xs bg-rose-500 hover:bg-rose-600 text-white font-bold transition-colors shadow-lg cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODALE : IMPRESSION REPORT CONFIG */}
        {printModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
              
              {/* En-tête modale */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Printer size={18} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Imprimer les Nouveaux Venus</h3>
                    <p className="text-slate-400 text-[10px]">Configurez la période du rapport</p>
                  </div>
                </div>
                <button onClick={() => setPrintModalOpen(false)} className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Corps de la modale */}
              <div className="px-6 py-5 space-y-4">
                {/* SELECT : Type de période */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Type de période
                  </label>
                  <select
                    value={printPeriodType}
                    onChange={e => setPrintPeriodType(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer font-bold"
                  >
                    <option value="all">Toutes les années et tous les mois</option>
                    <option value="year">Année entière</option>
                    <option value="month-year">Mois spécifique</option>
                  </select>
                </div>

                {/* SELECT : Année (visible pour month-year et year) */}
                {(printPeriodType === 'month-year' || printPeriodType === 'year') && (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Année
                    </label>
                    {availableYears.length === 0 ? (
                      <p className="text-slate-500 text-xs italic">Aucun enregistrement en base</p>
                    ) : (
                      <select
                        value={printYear}
                        onChange={e => setPrintYear(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer font-bold"
                      >
                        {availableYears.map(yr => (
                          <option key={yr} value={yr}>{yr}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* SELECT : Mois (visible seulement pour month-year) */}
                {printPeriodType === 'month-year' && (
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Mois
                    </label>
                    <select
                      value={printMonth}
                      onChange={e => setPrintMonth(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer font-bold"
                    >
                      <option value="">— Tous les mois de l'année —</option>
                      {printAvailableMonths.map(m => (
                        <option key={m} value={m}>{MONTHS[m - 1].label} {printYear}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Pied modale */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/50">
                <button
                  onClick={() => setPrintModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-750 text-white font-bold transition-colors border border-slate-750 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={launchPrint}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs bg-primary hover:bg-primary/90 text-white font-bold transition-colors shadow-md shadow-primary/15 cursor-pointer"
                >
                  <Printer size={13} />
                  Lancer l'impression
                </button>
              </div>

            </div>
          </div>
        )}

      </AdminLayout>
    </>
  )
}
