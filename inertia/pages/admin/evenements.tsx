import { Head, useForm, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import {
  Plus, Search, Pencil, Trash2, X, Check,
  CalendarDays, MapPin, Tag, Save, AlertCircle, RefreshCw
} from 'lucide-react'

type Status = 'a_venir' | 'en_cours' | 'termine' | 'annule'

interface CatEvent {
  id: number
  name: string
}

interface Evenement {
  id: number
  name: string
  description: string | null
  content: string | null
  place: string | null
  date: string | null // "YYYY-MM-DD"
  status: Status
  catEventId: number
  catEvent: CatEvent | null
}

const statusStyles: Record<Status, string> = {
  a_venir: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  en_cours: 'bg-green-500/10 text-green-400 border-green-500/20',
  termine: 'bg-slate-700 text-slate-400 border-slate-600',
  annule: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const statusLabels: Record<Status, string> = {
  a_venir: 'À venir',
  en_cours: 'En cours',
  termine: 'Passé',
  annule: 'Annulé',
}

export default function AdminEvenements({
  events,
  categories,
  filters
}: {
  events: Evenement[]
  categories: CatEvent[]
  filters: { search: string; status: string }
}) {
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | 'category' | null>(null)
  const [selected, setSelected] = useState<Evenement | null>(null)
  
  // Local filter states
  const [search, setSearch] = useState(filters.search || '')
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all')

  // CatEvent inline editing states
  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [editingCatName, setEditingCatName] = useState('')

  // Event Form
  const eventForm = useForm({
    name: '',
    description: '',
    place: '',
    date: '',
    status: 'a_venir' as Status,
    catEventId: categories.length > 0 ? categories[0].id : 0
  })

  // Category Form
  const catForm = useForm({
    name: ''
  })

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10
  const total = events.length
  const lastPage = Math.ceil(total / perPage)
  const paginatedEvents = events.slice((currentPage - 1) * perPage, currentPage * perPage)

  const meta = {
    total,
    perPage,
    currentPage,
    lastPage,
    firstPage: 1
  }

  // Handle live filters
  function triggerFilters(searchVal: string, statusVal: string) {
    router.get(
      '/admin/evenements',
      { search: searchVal, status: statusVal },
      { preserveState: true, replace: true }
    )
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearch(val)
    triggerFilters(val, statusFilter)
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setStatusFilter(val)
    triggerFilters(search, val)
  }

  // Modals actions
  function openAdd() {
    eventForm.reset()
    if (categories.length > 0) {
      eventForm.setData('catEventId', categories[0].id)
    }
    setModal('add')
  }

  function openEdit(e: Evenement) {
    setSelected(e)
    eventForm.setData({
      name: e.name,
      description: e.description || '',
      place: e.place || '',
      date: e.date || '',
      status: e.status,
      catEventId: e.catEventId
    })
    setModal('edit')
  }

  function openDelete(e: Evenement) {
    setSelected(e)
    setModal('delete')
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
    eventForm.clearErrors()
    catForm.clearErrors()
    setEditingCatId(null)
  }

  // Event Save & Delete Submit
  function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add') {
      eventForm.post('/admin/evenements', {
        onSuccess: () => closeModal()
      })
    } else if (modal === 'edit' && selected) {
      eventForm.put(`/admin/evenements/${selected.id}`, {
        onSuccess: () => closeModal()
      })
    }
  }

  function handleDeleteEvent() {
    if (selected) {
      router.delete(`/admin/evenements/${selected.id}`, {
        onSuccess: () => closeModal()
      })
    }
  }

  // Category Submit handlers
  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    catForm.post('/admin/evenements/categories', {
      onSuccess: () => {
        catForm.reset()
      }
    })
  }

  function startEditCategory(c: CatEvent) {
    setEditingCatId(c.id)
    setEditingCatName(c.name)
  }

  function handleSaveCategoryName(id: number) {
    if (!editingCatName.trim()) return
    router.put(`/admin/evenements/categories/${id}`, { name: editingCatName }, {
      onSuccess: () => {
        setEditingCatId(null)
      }
    })
  }

  function handleDeleteCategory(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      router.delete(`/admin/evenements/categories/${id}`)
    }
  }

  return (
    <>
      <Head title="Événements — Admin Phila MDT" />
      <AdminLayout title="Gestion des Événements">

        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Événements de l'église</h2>
            <p className="text-slate-400 text-sm mt-1">Créez et gérez les grands événements et leurs catégories.</p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setModal('category')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Tag size={16} /> Catégories
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} /> Ajouter un événement
            </button>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 bg-slate-900/40 p-4 border border-slate-800/80 rounded-2xl">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Rechercher par titre d'événement..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="w-full md:w-60">
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="a_venir">À venir</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Passé (Terminé)</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
        </div>

        {/* Main List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800">
                  <th className="text-left text-slate-400 font-bold px-6 py-4 text-xs uppercase tracking-wider">Titre / Description</th>
                  <th className="text-left text-slate-400 font-bold px-6 py-4 text-xs uppercase tracking-wider">Date</th>
                  <th className="text-left text-slate-400 font-bold px-6 py-4 text-xs uppercase tracking-wider">Lieu</th>
                  <th className="text-left text-slate-400 font-bold px-6 py-4 text-xs uppercase tracking-wider">Catégorie</th>
                  <th className="text-left text-slate-400 font-bold px-6 py-4 text-xs uppercase tracking-wider">Statut</th>
                  <th className="text-center text-slate-400 font-bold px-6 py-4 text-xs uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedEvents.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-bold text-sm">{e.name}</p>
                        <p className="text-slate-500 text-xs mt-1 line-clamp-1 max-w-sm">{e.description || 'Aucune description'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-300">
                        <CalendarDays size={14} className="text-primary" />
                        {e.date ? new Date(e.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non planifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin size={14} className="text-slate-500" />
                        {e.place || 'Non spécifié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700/60">
                        {e.catEvent?.name || 'Sans catégorie'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[e.status]}`}>
                        {statusLabels[e.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(e)}
                          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => openDelete(e)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      <AlertCircle size={24} className="mx-auto mb-2 text-slate-600" />
                      Aucun événement trouvé pour ces critères.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {lastPage > 1 && (
            <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
          )}
        </div>

        {/* Modal: Add or Edit Event */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-950/20">
                <h3 className="text-white text-lg font-black">{modal === 'add' ? 'Créer un Événement' : 'Modifier l\'Événement'}</h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveEvent} className="p-8 space-y-5">
                {/* Title */}
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Titre de l'événement</label>
                  <input
                    value={eventForm.data.name}
                    onChange={(e) => eventForm.setData('name', e.target.value)}
                    required
                    placeholder="Ex: Conférence des Couples"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                  {eventForm.errors.name && <p className="text-red-400 text-xs mt-1">{eventForm.errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Date</label>
                    <input
                      type="date"
                      value={eventForm.data.date}
                      onChange={(e) => eventForm.setData('date', e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    />
                    {eventForm.errors.date && <p className="text-red-400 text-xs mt-1">{eventForm.errors.date}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Catégorie</label>
                    <select
                      value={eventForm.data.catEventId}
                      onChange={(e) => eventForm.setData('catEventId', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <option value={0}>Aucune catégorie</option>
                      )}
                    </select>
                    {eventForm.errors.catEventId && <p className="text-red-400 text-xs mt-1">{eventForm.errors.catEventId}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Place */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Lieu</label>
                    <input
                      value={eventForm.data.place}
                      onChange={(e) => eventForm.setData('place', e.target.value)}
                      placeholder="Ex: Temple principal"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    />
                    {eventForm.errors.place && <p className="text-red-400 text-xs mt-1">{eventForm.errors.place}</p>}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Statut</label>
                    <select
                      value={eventForm.data.status}
                      onChange={(e) => eventForm.setData('status', e.target.value as Status)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="a_venir">À venir</option>
                      <option value="en_cours">En cours</option>
                      <option value="termine">Passé (Terminé)</option>
                      <option value="annule">Annulé</option>
                    </select>
                    {eventForm.errors.status && <p className="text-red-400 text-xs mt-1">{eventForm.errors.status}</p>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Description courte</label>
                  <textarea
                    rows={3}
                    value={eventForm.data.description}
                    onChange={(e) => eventForm.setData('description', e.target.value)}
                    placeholder="Brève description de l'événement (min. 10 caract.)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary resize-none transition-colors"
                  />
                  {eventForm.errors.description && <p className="text-red-400 text-xs mt-1">{eventForm.errors.description}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={eventForm.processing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <Check size={16} /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Category Manager CRUD */}
        {modal === 'category' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-950/20">
                <h3 className="text-white text-lg font-black flex items-center gap-2"><Tag size={18} className="text-primary" /> Gérer les Catégories</h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8">
                {/* Form to add */}
                <form onSubmit={handleAddCategory} className="flex gap-2 mb-2">
                  <input
                    value={catForm.data.name}
                    onChange={(e) => catForm.setData('name', e.target.value)}
                    required
                    placeholder="Ex: Conférences"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={catForm.processing || !catForm.data.name.trim()}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </form>
                {catForm.errors.name && <p className="text-red-400 text-xs mb-4">{catForm.errors.name}</p>}

                {/* Categories List */}
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {categories.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-6">Aucune catégorie disponible.</p>
                  )}
                  {categories.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 bg-slate-950/40 border border-slate-800/80 px-4 py-3 rounded-xl">
                      {editingCatId === c.id ? (
                        <>
                          <input
                            autoFocus
                            value={editingCatName}
                            onChange={(e) => setEditingCatName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveCategoryName(c.id)
                              if (e.key === 'Escape') setEditingCatId(null)
                            }}
                            className="flex-1 px-3 py-1.5 bg-slate-900 border border-primary/50 rounded-lg text-sm text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveCategoryName(c.id)}
                            className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Sauvegarder"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => setEditingCatId(null)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-1 text-slate-200 text-sm font-medium">{c.name}</span>
                          <button
                            onClick={() => startEditCategory(c)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Supprimer"
                          >
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

        {/* Modal: Delete Confirmation */}
        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-black text-xl">Supprimer l'Événement</h3>
                <p className="text-slate-400 text-sm mt-2">
                  Êtes-vous sûr de vouloir supprimer <strong className="text-white">"{selected.name}"</strong> ? Cette action est irréversible.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </>
  )
}
