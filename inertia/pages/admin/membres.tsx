import { Head, router, useForm } from '@inertiajs/react'
import { useState, useEffect, useRef } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import CloudinaryImage from '../../components/CloudinaryImage'
import { Plus, Pencil, Trash2, X, Check, User, Mail, Phone, Calendar, ShieldCheck, Search, Printer, ImageIcon, Upload } from 'lucide-react'

interface Ministry {
  id: number
  name: string
}

interface Member {
  id: number
  firstname: string
  lastname: string
  email: string | null
  phone: string | null
  gender: 'M' | 'F' | null
  dateIntegration: string | null
  statut: 'actif' | 'inactif'
  typeMember: 'responsable' | 'membre' | 'visiteur' | null
  ministryId: number | null
  ministry: Ministry | null
  createdAt: string
  coverImg: string | null
}


interface Props {
  members: {
    data: Member[]
    meta: any
  }
  ministries: Ministry[]
  filters: {
    ministryId: string | number | null
    search: string | null
  }
}

export default function AdminMembres({ members, ministries, filters }: Props) {
  // Filters State
  const [search, setSearch] = useState(filters.search || '')
  const [ministryId, setMinistryId] = useState(filters.ministryId || '')
  const isMounted = useRef(false)

  // Auto-filtering with debounce
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }

    const timeoutId = setTimeout(() => {
      router.get('/admin/membres', { search, ministryId }, {
        preserveState: true,
        replace: true,
      })
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [search, ministryId])

  // Modals State
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [printModal, setPrintModal] = useState(false)
  const [printMode, setPrintMode] = useState<'global' | 'ministry'>('global')
  const [printMinistryId, setPrintMinistryId] = useState('')

  // Form for Add/Edit
  const form = useForm({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    gender: 'M' as 'M' | 'F',
    dateIntegration: '',
    statut: 'actif' as 'actif' | 'inactif',
    typeMember: 'membre' as 'responsable' | 'membre' | 'visiteur',
    ministryId: '' as number | string,
    coverImg: null as File | null,
  })

  // Ref for file input
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Preview logic for member image
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    if (form.data.coverImg) {
      const url = URL.createObjectURL(form.data.coverImg)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else if (selectedMember?.coverImg) {
      setPreview(selectedMember.coverImg)
    } else {
      setPreview(null)
    }
  }, [form.data.coverImg, selectedMember])


  const handleReset = () => {
    setSearch('')
    setMinistryId('')
  }

  function openAdd() {
    form.reset()
    form.clearErrors()
    setSelectedMember(null)
    setModal('add')
  }

  function openEdit(m: Member) {
    form.reset()
    form.clearErrors()
    form.setData({
      firstname: m.firstname,
      lastname: m.lastname,
      email: m.email || '',
      phone: m.phone || '',
      gender: m.gender || 'M',
      dateIntegration: m.dateIntegration ? m.dateIntegration.split('T')[0] : '',
      statut: m.statut,
      typeMember: m.typeMember || 'membre',
      ministryId: m.ministryId || '',
      coverImg: null,
    })
    setSelectedMember(m)
    setModal('edit')
  }


  function submit() {
    if (modal === 'add') {
      form.post('/admin/members', {
        forceFormData: true,
        onSuccess: () => setModal(null)
      })
    } else if (modal === 'edit' && selectedMember) {
      form.post(`/admin/members/${selectedMember.id}?_method=PUT`, {
        forceFormData: true,
        onSuccess: () => setModal(null)
      })
    }
  }


  function handlePrint() {
    let url = '/admin/membres/print'
    if (printMode === 'ministry' && printMinistryId) {
      url += `?ministryId=${printMinistryId}`
    }
    window.open(url, '_blank')
    setPrintModal(false)
  }

  function destroy() {
    if (selectedMember) {
      router.delete(`/admin/members/${selectedMember.id}`, {
        onSuccess: () => setModal(null)
      })
    }
  }

  return (
    <>
      <Head title="Membres — Admin Phila MDT" />
      <AdminLayout title="Gestion des membres">
        
        {/* Unified Header & Actions Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-white font-bold text-lg whitespace-nowrap px-2">Membres</h2>
            
            <div className="flex flex-1 items-center gap-2 max-w-3xl">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Rechercher (nom, email, tel)..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-all"
                />
                <div className="absolute left-3 top-2.5 text-slate-500">
                  <Search size={16} />
                </div>
              </div>

              <select 
                value={ministryId}
                onChange={(e) => setMinistryId(e.target.value)}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-all cursor-pointer min-w-[160px]"
              >
                <option value="">Tous les ministères</option>
                {ministries
                  .filter(m => !m.name.toLowerCase().includes('test'))
                  .map(min => (
                    <option key={min.id} value={min.id}>{min.name}</option>
                  ))
                }
              </select>
              
              {(filters.search || filters.ministryId) && (
                <button 
                  onClick={handleReset} 
                  title="Réinitialiser"
                  className="text-slate-500 hover:text-white p-2 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setPrintMode('global'); setPrintModal(true); }} 
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Printer size={16} /> <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button 
              onClick={openAdd} 
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-primary/20 active:scale-95"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Ajouter un membre</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Membre</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Ministère</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type / Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.data.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {m.coverImg ? (
                        <CloudinaryImage 
                          src={m.coverImg} 
                          width={100} 
                          height={100} 
                          alt={`${m.firstname} ${m.lastname}`} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-400 border border-slate-750 font-bold uppercase text-xs shrink-0 shadow-sm">
                          {m.firstname[0]}{m.lastname[0]}
                        </div>
                      )}
                      <div>
                        <div className="text-white font-semibold">{m.firstname} {m.lastname}</div>
                        <div className="text-slate-500 text-xs">{m.gender === 'M' ? 'Homme' : 'Femme'}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {m.email && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Mail size={12} className="text-slate-600" /> {m.email}
                        </div>
                      )}
                      {m.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Phone size={12} className="text-slate-600" /> {m.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">
                      {m.ministry ? (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                          {m.ministry.name}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Aucun ministère</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.statut === 'actif' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-[10px] uppercase font-bold tracking-tighter ${m.statut === 'actif' ? 'text-green-500' : 'text-red-500'}`}>
                          {m.statut}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 rounded bg-slate-800 w-fit">
                        {m.typeMember || 'Non défini'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => { setSelectedMember(m); setModal('delete') }} className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {members.data.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              Aucun membre trouvé.
            </div>
          )}
        </div>

        <div className="mt-6">
          <Pagination meta={members.meta} links={(members as any).links} />
        </div>

        {/* MODAL ADD/EDIT */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un membre' : 'Modifier le membre'}</h3>
                <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {/* Photo de profil du membre */}
                <div className="space-y-2 pb-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <ImageIcon size={14} /> Photo de profil (Optionnel)
                  </label>
                  <div className="flex items-center gap-6 bg-slate-800/20 border border-slate-800/80 p-4 rounded-2xl">
                    <div className="relative group shrink-0 w-20 h-20 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-900 flex items-center justify-center shadow-lg">
                      {preview ? (
                        <CloudinaryImage 
                          src={preview} 
                          width={150} 
                          height={150} 
                          alt="Aperçu" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User size={32} className="text-slate-600" />
                      )}
                      {preview && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[9px] text-white font-bold uppercase tracking-wider">Aperçu</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors cursor-pointer active:scale-95"
                        >
                          <Upload size={13} /> {form.data.coverImg ? 'Changer' : 'Sélectionner une photo'}
                        </button>
                        {form.data.coverImg && (
                          <button
                            type="button"
                            onClick={() => form.setData('coverImg', null)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-colors"
                            title="Supprimer la sélection"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={coverInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={e => form.setData('coverImg', e.target.files ? e.target.files[0] : null)} 
                      />
                      <p className="text-[10px] text-slate-500">
                        {form.data.coverImg ? form.data.coverImg.name : 'JPG, PNG ou WEBP. Max 2 Mo.'}
                      </p>
                    </div>
                  </div>
                  {form.errors.coverImg && <p className="text-red-400 text-[10px] italic">{form.errors.coverImg}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Prénom <span className="text-red-500">*</span></label>
                    <input 
                      value={form.data.firstname} 
                      onChange={e => form.setData('firstname', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" 
                    />
                    {form.errors.firstname && <p className="text-red-400 text-[10px] mt-1">{form.errors.firstname}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Nom <span className="text-red-500">*</span></label>
                    <input 
                      value={form.data.lastname} 
                      onChange={e => form.setData('lastname', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" 
                    />
                    {form.errors.lastname && <p className="text-red-400 text-[10px] mt-1">{form.errors.lastname}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Email</label>
                    <input 
                      type="email"
                      value={form.data.email} 
                      onChange={e => form.setData('email', e.target.value)}
                      className={`w-full mt-1 px-4 py-2.5 bg-slate-800 border ${form.errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary`} 
                    />
                    {form.errors.email && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Téléphone</label>
                    <input 
                      value={form.data.phone} 
                      onChange={e => form.setData('phone', e.target.value)}
                      className={`w-full mt-1 px-4 py-2.5 bg-slate-800 border ${form.errors.phone ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary`} 
                    />
                    {form.errors.phone && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Genre</label>
                    <select 
                      value={form.data.gender} 
                      onChange={e => form.setData('gender', e.target.value as any)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="M">Homme</option>
                      <option value="F">Femme</option>
                    </select>
                    {form.errors.gender && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.gender}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Statut</label>
                    <select 
                      value={form.data.statut} 
                      onChange={e => form.setData('statut', e.target.value as any)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="actif">Actif</option>
                      <option value="inactif">Inactif</option>
                    </select>
                    {form.errors.statut && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.statut}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Type de membre</label>
                    <select 
                      value={form.data.typeMember} 
                      onChange={e => form.setData('typeMember', e.target.value as any)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="membre">Membre</option>
                      <option value="responsable">Responsable</option>
                      <option value="visiteur">Visiteur</option>
                    </select>
                    {form.errors.typeMember && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.typeMember}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Ministère</label>
                    <select 
                      value={form.data.ministryId} 
                      onChange={e => form.setData('ministryId', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Aucun --</option>
                      {ministries.map(min => (
                        <option key={min.id} value={min.id}>{min.name}</option>
                      ))}
                    </select>
                    {form.errors.ministryId && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.ministryId}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Date d'intégration</label>
                    <input 
                      type="date"
                      value={form.data.dateIntegration} 
                      onChange={e => form.setData('dateIntegration', e.target.value)}
                      className={`w-full mt-1 px-4 py-2.5 bg-slate-800 border ${form.errors.dateIntegration ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary`} 
                    />
                    {form.errors.dateIntegration && <p className="text-red-400 text-[10px] mt-1 italic">{form.errors.dateIntegration}</p>}
                  </div>
                </div>


                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setModal(null)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                  <button type="submit" disabled={form.processing} className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors disabled:opacity-50">
                    <Check size={16} /> {form.processing ? 'Chargement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL DELETE */}
        {modal === 'delete' && selectedMember && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer le membre</h3>
                <p className="text-slate-400 text-sm mt-1">Voulez-vous vraiment supprimer <strong className="text-white">{selectedMember.firstname} {selectedMember.lastname}</strong> ?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Annuler</button>
                <button onClick={destroy} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PRINT OPTIONS */}
        {printModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Printer size={18} className="text-primary" /> Options d'impression
                </h3>
                <button onClick={() => setPrintModal(false)} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Choisissez les données que vous souhaitez imprimer.</p>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                    <input 
                      type="radio" 
                      name="print_type" 
                      checked={printMode === 'global'} 
                      onChange={() => setPrintMode('global')}
                      className="text-primary focus:ring-primary h-4 w-4 bg-slate-900 border-slate-600" 
                    />
                    <div>
                      <div className="text-white font-medium text-sm">Impression Globale</div>
                      <div className="text-slate-500 text-xs">Tous les membres de l'église.</div>
                    </div>
                  </label>

                  <label className="flex flex-col gap-2 p-3 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="print_type" 
                        checked={printMode === 'ministry'} 
                        onChange={() => {
                          setPrintMode('ministry')
                          if (!printMinistryId) {
                            setPrintMinistryId(ministries.filter(m => !m.name.toLowerCase().includes('test'))[0]?.id.toString() || '1')
                          }
                        }}
                        className="text-primary focus:ring-primary h-4 w-4 bg-slate-900 border-slate-600" 
                      />
                      <div>
                        <div className="text-white font-medium text-sm">Par Ministère</div>
                        <div className="text-slate-500 text-xs">Uniquement les membres d'un département.</div>
                      </div>
                    </div>
                    
                    {printMode === 'ministry' && (
                      <select 
                        value={printMinistryId}
                        onChange={(e) => setPrintMinistryId(e.target.value)}
                        className="mt-2 w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-primary"
                      >
                        {ministries
                          .filter(m => !m.name.toLowerCase().includes('test'))
                          .map(min => (
                            <option key={min.id} value={min.id}>{min.name}</option>
                          ))
                        }
                      </select>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button onClick={() => setPrintModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors">Annuler</button>
                <button onClick={handlePrint} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-lg shadow-primary/20">
                  Générer le document
                </button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </>
  )
}

