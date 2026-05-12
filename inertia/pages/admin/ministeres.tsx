import { Head, router, useForm } from '@inertiajs/react'
import { useState, useRef, useEffect } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Plus, Pencil, Trash2, X, Check, ImageIcon, FileText, Upload } from 'lucide-react'

interface Ministry {
  id: number
  name: string
  description: string | null
  content: string | null
  coverImg: string | null
  badgeColor: string | null
  tag: string | null
}

const COULEURS = [
  { label: 'Bleu',   value: 'bg-blue-500'   },
  { label: 'Vert',   value: 'bg-green-500'  },
  { label: 'Violet', value: 'bg-purple-500' },
  { label: 'Rose',   value: 'bg-pink-500'   },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Cyan',   value: 'bg-cyan-500'   },
]

export default function AdminMinisteres({ ministries }: { ministries: Ministry[] }) {
  // Pagination State for Ministries
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  const total = (ministries || []).length
  const lastPage = Math.ceil(total / perPage)
  const paginatedMinistries = (ministries || []).slice((currentPage - 1) * perPage, currentPage * perPage)
  const meta = { total, perPage, currentPage, lastPage, firstPage: 1 }

  // Modals State
  const [minModal, setMinModal] = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selectedMin, setSelectedMin] = useState<Ministry | null>(null)

  // Refs for file inputs
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Form for Ministries
  const minForm = useForm({
    name: '',
    description: '',
    content: '',
    coverImg: null as File | null,
    badgeColor: 'bg-blue-500',
    tag: '',
  })

  // Preview logic
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    if (minForm.data.coverImg) {
      const url = URL.createObjectURL(minForm.data.coverImg)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    } else if (selectedMin?.coverImg) {
      setPreview(selectedMin.coverImg)
    } else {
      setPreview(null)
    }
  }, [minForm.data.coverImg, selectedMin])

  // ======================
  // Handlers Ministries
  // ======================
  function openAddMin() {
    minForm.reset()
    minForm.clearErrors()
    setSelectedMin(null)
    setMinModal('add')
  }

  function openEditMin(m: Ministry) {
    minForm.reset()
    minForm.clearErrors()
    minForm.setData({
      name: m.name,
      description: m.description || '',
      content: m.content || '',
      coverImg: null,
      badgeColor: m.badgeColor || 'bg-blue-500',
      tag: m.tag || '',
    })
    setSelectedMin(m)
    setMinModal('edit')
  }

  function saveMin() {
    if (minModal === 'add') {
      minForm.post('/admin/ministeres', {
        forceFormData: true,
        onSuccess: () => setMinModal(null)
      })
    } else if (minModal === 'edit' && selectedMin) {
      // Pour les uploads en PUT, on utilise POST avec spoofing _method: 'put'
      // Utilisation de minForm.post avec transform pour inclure _method
      minForm.transform((data) => ({
        ...data,
        _method: 'put'
      })).post(`/admin/ministeres/${selectedMin.id}`, {
        forceFormData: true,
        onSuccess: () => setMinModal(null)
      })
    }
  }

  function deleteMin() {
    if (selectedMin) {
      router.delete(`/admin/ministeres/${selectedMin.id}`, {
        onSuccess: () => setMinModal(null)
      })
    }
  }

  return (
    <>
      <Head title="Ministères — Admin Phila MDT" />
      <AdminLayout title="Gestion des ministères">
        
        {/* SECTION: MINISTÈRES */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white font-bold text-lg">Liste des Ministères</h2>
            <p className="text-slate-400 text-sm">Départements et ministères spécifiques de l'église.</p>
          </div>
          <button onClick={openAddMin} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
            <Plus size={16} /> Ajouter un ministère
          </button>
        </div>

        {(!ministries || ministries.length === 0) ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400 shadow-xl">
            Aucun ministère créé pour le moment.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-5 mb-8">
              {paginatedMinistries.map((m) => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-600 transition-colors shadow-xl">
                  <div className={`h-1.5 w-full ${m.badgeColor || 'bg-slate-500'}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {m.coverImg ? (
                          <img src={m.coverImg} alt={m.name} className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm" />
                        ) : (
                          <div className={`w-12 h-12 ${m.badgeColor || 'bg-slate-500'} rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm`}>
                            {m.name[0]}
                          </div>
                        )}
                        <div>
                          <h3 className="text-white font-bold">{m.name}</h3>
                          {m.tag && <span className="text-[10px] text-slate-500 uppercase tracking-wider">{m.tag}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => openEditMin(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => { setSelectedMin(m); setMinModal('delete') }} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{m.description || 'Aucune description'}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {lastPage > 1 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl mt-6">
                <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
              </div>
            )}
          </>
        )}

        {/* =========================================================
            MODALS MINISTRIES
        ========================================================= */}
        {(minModal === 'add' || minModal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{minModal === 'add' ? 'Ajouter un ministère' : 'Modifier le ministère'}</h3>
                <button onClick={() => setMinModal(null)} className="text-slate-400 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); saveMin(); }} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-2 gap-5">
                  {/* Nom */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Nom du ministère <span className="text-red-500">*</span></label>
                    <input 
                      value={minForm.data.name} 
                      onChange={e => minForm.setData('name', e.target.value)}
                      className={`w-full mt-1 px-4 py-2.5 bg-slate-800 border ${minForm.errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl text-sm text-white focus:outline-none focus:border-primary`} 
                      placeholder="Ex: Chorale PHILA"
                    />
                    {minForm.errors.name && <p className="text-red-400 text-xs mt-1 italic">{minForm.errors.name}</p>}
                  </div>

                  {/* Tag */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tag personnalisé</label>
                    <input 
                      value={minForm.data.tag} 
                      onChange={e => minForm.setData('tag', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" 
                      placeholder="Ex: Louange"
                    />
                  </div>
                </div>

                {/* Images Upload & Preview */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                    <ImageIcon size={12} /> Image de couverture
                  </label>
                  <div className="flex gap-4 items-center">
                    <div 
                      onClick={() => coverInputRef.current?.click()}
                      className={`flex-1 h-32 border-2 border-dashed ${minForm.errors.coverImg ? 'border-red-500 bg-red-500/5' : 'border-slate-700 hover:border-primary bg-slate-800/50'} rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group`}
                    >
                      <input 
                        type="file" 
                        ref={coverInputRef} 
                        className="hidden" 
                        onChange={e => minForm.setData('coverImg', e.target.files ? e.target.files[0] : null)} 
                      />
                      <Upload size={24} className="text-slate-500 group-hover:text-primary transition-colors" />
                      <span className="text-xs text-slate-500 mt-2">
                        {minForm.data.coverImg ? minForm.data.coverImg.name : 'Cliquez pour uploader une image'}
                      </span>
                    </div>

                    {preview && (
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-700 relative group">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold uppercase">Aperçu</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {minForm.errors.coverImg && <p className="text-red-400 text-[10px] italic">{minForm.errors.coverImg}</p>}
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">Couleur du badge</label>
                  <div className="flex gap-2 flex-wrap">
                    {COULEURS.map(({ label, value }) => (
                      <button key={value} title={label} type="button" onClick={() => minForm.setData('badgeColor', value)}
                        className={`w-8 h-8 rounded-lg ${value} border-2 transition-all ${minForm.data.badgeColor === value ? 'border-white scale-110' : 'border-transparent'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Description & Contenu */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Description courte</label>
                    <textarea 
                      rows={2} 
                      value={minForm.data.description} 
                      onChange={e => minForm.setData('description', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary resize-none" 
                      placeholder="Une brève introduction..."
                    />
                    {minForm.errors.description && <p className="text-red-400 text-xs mt-1 italic">{minForm.errors.description}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-2">
                      <FileText size={12} /> Contenu complet (Détails)
                    </label>
                    <textarea 
                      rows={4} 
                      value={minForm.data.content} 
                      onChange={e => minForm.setData('content', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary resize-none" 
                      placeholder="Détails complets sur le ministère, sa mission..."
                    />
                    {minForm.errors.content && <p className="text-red-400 text-xs mt-1 italic">{minForm.errors.content}</p>}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setMinModal(null)} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                  <button type="submit" disabled={minForm.processing} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors disabled:opacity-50">
                    <Check size={15} /> {minForm.processing ? 'Envoi...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {minModal === 'delete' && selectedMin && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer ce ministère</h3>
                <p className="text-slate-400 text-sm mt-1">Êtes-vous sûr de vouloir supprimer <strong className="text-white">{selectedMin.name}</strong> ?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setMinModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Annuler</button>
                <button onClick={deleteMin} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Supprimer</button>
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
