import { Head, useForm, router } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import { Plus, Pencil, Trash2, X, Check, Clock, Calendar as CalendarIcon, Tag, Save } from 'lucide-react'

interface CatActivity {
  id: number
  name: string
}

interface Creneau {
  id: number
  day: string
  hourStart: string | null
  hourEnd: string | null
  title: string
  place: string | null
  catActivityId: number
  catActivity: CatActivity | null
}

export default function AdminAgenda({ agendas, categories, currentWeek }: { agendas: Creneau[], categories: CatActivity[], currentWeek: string }) {
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | 'category' | null>(null)
  const [editingCat, setEditingCat] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [selected, setSelected] = useState<Creneau | null>(null)
  
  // To navigate between weeks
  const [week, setWeek] = useState(currentWeek)

  // Form for Agenda
  const form = useForm({
    day: '',
    title: '',
    hourStart: '',
    hourEnd: '',
    place: '',
    catActivityId: categories.length > 0 ? categories[0].id : 0
  })

  // Form for Category
  const catForm = useForm({
    name: ''
  })

  function handleWeekChange(newWeek: string) {
    setWeek(newWeek)
    router.get('/admin/agenda', { week: newWeek }, { preserveState: true })
  }

  function openAdd() { 
    form.reset()
    if (categories.length > 0) form.setData('catActivityId', categories[0].id)
    setModal('add') 
  }

  function openEdit(c: Creneau) { 
    setSelected(c)
    form.setData({
      day: c.day,
      title: c.title,
      hourStart: c.hourStart || '',
      hourEnd: c.hourEnd || '',
      place: c.place || '',
      catActivityId: c.catActivityId
    })
    setModal('edit') 
  }

  function openDelete(c: Creneau) { 
    setSelected(c)
    setModal('delete') 
  }

  function closeModal() { 
    setModal(null)
    setSelected(null) 
    form.clearErrors()
    catForm.clearErrors()
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') {
      form.post('/admin/agenda', {
        onSuccess: () => closeModal()
      })
    } else if (modal === 'edit' && selected) {
      form.put(`/admin/agenda/${selected.id}`, {
        onSuccess: () => closeModal()
      })
    }
  }

  function handleDelete() {
    if (selected) {
      router.delete(`/admin/agenda/${selected.id}`, {
        onSuccess: () => closeModal()
      })
    }
  }

  function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault()
    catForm.post('/admin/agenda/categories', {
      onSuccess: () => {
        catForm.reset()
        // Stay open to add multiple or show success
      }
    })
  }

  function handleDeleteCategory(id: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      router.delete(`/admin/agenda/categories/${id}`)
    }
  }

  function startEditCat(cat: CatActivity) {
    setEditingCat(cat.id)
    setEditingName(cat.name)
  }

  function cancelEditCat() {
    setEditingCat(null)
    setEditingName('')
  }

  function saveEditCat(id: number) {
    if (!editingName.trim()) return
    router.put(`/admin/agenda/categories/${id}`, { name: editingName.trim() }, {
      onSuccess: () => cancelEditCat()
    })
  }

  // Grouper les données par jour (day)
  // Get unique dates
  const uniqueDays = Array.from(new Set(agendas.map(a => a.day))).sort()

  const byDay = uniqueDays.map(dateStr => {
    // Convert YYYY-MM-DD to "Lundi 15 Avril"
    const dateObj = new Date(dateStr)
    const formattedDay = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(dateObj)
    
    return {
      dateStr,
      formattedDay,
      items: agendas.filter(a => a.day === dateStr)
    }
  })

  // Colors for generic display
  const colors = ['border-orange-500/20 text-orange-400 bg-orange-500/10', 'border-blue-500/20 text-blue-400 bg-blue-500/10', 'border-purple-500/20 text-purple-400 bg-purple-500/10', 'border-green-500/20 text-green-400 bg-green-500/10', 'border-pink-500/20 text-pink-400 bg-pink-500/10']
  
  return (
    <>
      <Head title="Agenda — Admin Phila MDT" />
      <AdminLayout title="Gestion de l'agenda">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <p className="text-slate-400 text-sm flex-1">Gérez les créneaux hebdomadaires des cultes et activités.</p>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl">
              <CalendarIcon size={16} className="text-slate-400" />
              <input 
                type="week" 
                value={week} 
                onChange={(e) => handleWeekChange(e.target.value)}
                className="bg-transparent text-sm text-white focus:outline-none w-36 cursor-pointer"
              />
            </div>

            <button onClick={() => setModal('category')} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              <Tag size={16} /> Catégories
            </button>
            <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
              <Plus size={16} /> Créneau
            </button>
          </div>
        </div>

        {/* Grille par jour */}
        <div className="space-y-6 mb-8">
          {byDay.map(({ dateStr, formattedDay, items }) => (
            <div key={dateStr} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 py-3 border-b border-slate-800 bg-slate-800/40">
                <h2 className="font-bold text-white uppercase text-xs tracking-widest">{formattedDay}</h2>
              </div>
              <div className="divide-y divide-slate-800/50">
                {items.map((c, index) => (
                  <div key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 hover:bg-slate-800/30 transition-colors group">
                    <div className="flex items-center gap-1.5 text-slate-400 min-w-[100px]">
                      <Clock size={14} className="text-primary" />
                      <span className="text-sm font-mono font-bold text-slate-300">
                        {c.hourStart ? c.hourStart.substring(0, 5) : '--:--'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold">{c.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{c.place || 'Aucun lieu spécifié'}</p>
                    </div>
                    {c.catActivity && (
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${colors[c.catActivity.id % colors.length]}`}>
                        {c.catActivity.name}
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-3 sm:mt-0">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => openDelete(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {byDay.length === 0 && (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center gap-2">
              <CalendarIcon size={32} className="text-slate-600 mb-2" />
              <p>Aucun créneau planifié pour cette semaine.</p>
              <button onClick={openAdd} className="text-primary hover:text-primary-dark text-sm mt-2 font-medium">Planifier le premier créneau</button>
            </div>
          )}
        </div>

        {/* Modal Add/Edit */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un créneau' : 'Modifier le créneau'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Titre du programme</label>
                    <input 
                      value={form.data.title} 
                      onChange={(e) => form.setData('title', e.target.value)}
                      required
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="Ex: Culte d'Adoration"
                    />
                    {form.errors.title && <p className="text-red-400 text-[10px] mt-1">{form.errors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Date</label>
                    <input 
                      type="date" 
                      required
                      value={form.data.day} 
                      onChange={(e) => form.setData('day', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                    />
                    {form.errors.day && <p className="text-red-400 text-[10px] mt-1">{form.errors.day}</p>}
                  </div>
                  
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Heure de début</label>
                    <input 
                      type="time" 
                      value={form.data.hourStart} 
                      onChange={(e) => form.setData('hourStart', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Catégorie</label>
                    <select 
                      value={form.data.catActivityId} 
                      onChange={(e) => form.setData('catActivityId', Number(e.target.value))}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      {categories.length === 0 && <option value="" disabled>Aucune catégorie (Veuillez en créer une)</option>}
                    </select>
                    {form.errors.catActivityId && <p className="text-red-400 text-[10px] mt-1">{form.errors.catActivityId}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider">Lieu</label>
                    <input 
                      value={form.data.place} 
                      onChange={(e) => form.setData('place', e.target.value)}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" 
                      placeholder="Ex: Temple principal"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                  <button type="submit" disabled={form.processing || categories.length === 0} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors disabled:opacity-50">
                    <Check size={15} /> {form.processing ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Catégories */}
        {modal === 'category' && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-bold flex items-center gap-2"><Tag size={16} className="text-primary"/> Gérer les catégories</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6">
                <form onSubmit={handleSaveCategory} className="flex gap-2 mb-6">
                  <input 
                    value={catForm.data.name} 
                    onChange={(e) => catForm.setData('name', e.target.value)}
                    required
                    placeholder="Nouvelle catégorie (ex: Prière)"
                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary"
                  />
                  <button type="submit" disabled={catForm.processing || !catForm.data.name.trim()} className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                    Ajouter
                  </button>
                </form>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {categories.length === 0 && <p className="text-slate-500 text-sm text-center py-4">Aucune catégorie existante.</p>}
                  {categories.map(c => (
                    <div key={c.id} className="flex items-center gap-2 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
                      {editingCat === c.id ? (
                        <>
                          <input
                            autoFocus
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveEditCat(c.id); if (e.key === 'Escape') cancelEditCat() }}
                            className="flex-1 px-3 py-1.5 bg-slate-700 border border-primary/60 rounded-lg text-sm text-white focus:outline-none"
                          />
                          <button type="button" onClick={() => saveEditCat(c.id)} className="p-1.5 rounded-lg text-green-400 hover:bg-green-500/10 transition-colors" title="Sauvegarder">
                            <Save size={14} />
                          </button>
                          <button type="button" onClick={cancelEditCat} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Annuler">
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-white text-sm font-medium">{c.name}</span>
                          <button type="button" onClick={() => startEditCat(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" title="Modifier">
                            <Pencil size={14} />
                          </button>
                          <button type="button" onClick={() => handleDeleteCategory(c.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Supprimer">
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Delete */}
        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer ce créneau</h3>
                <p className="text-slate-400 text-sm mt-1">Êtes-vous sûr de vouloir supprimer <strong className="text-white">{selected.title}</strong> ? Cette action est irréversible.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm transition-colors">Annuler</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
