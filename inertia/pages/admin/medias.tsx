import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import { Plus, Search, Pencil, Trash2, X, Check, Play } from 'lucide-react'

type TypeMedia = 'Sermon' | 'Louange' | 'Témoignage' | 'Enseignement'

interface Media {
  id: number
  titre: string
  orateur: string
  date: string
  duree: string
  type: TypeMedia
  url: string
  thumbnail: string
}

const typeColors: Record<TypeMedia, string> = {
  Sermon:       'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Louange:      'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Témoignage:   'bg-green-500/10 text-green-400 border-green-500/20',
  Enseignement: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const thumbs = [
  'https://images.unsplash.com/photo-1519677584237-752f8853252e?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=400&auto=format&fit=crop',
]

const initialData: Media[] = [
  { id: 1, titre: 'La Foi qui déplace les montagnes', orateur: 'Pasteur Blonsky MBALA', date: '30 Mar 2025', duree: '52 min', type: 'Sermon',       url: '#', thumbnail: thumbs[0] },
  { id: 2, titre: 'Nuit de Louange — Aksanti Mungu',  orateur: 'Chorale MDT',            date: '22 Mar 2025', duree: '1h 20 min', type: 'Louange',   url: '#', thumbnail: thumbs[1] },
  { id: 3, titre: 'Témoignage de guérison',           orateur: 'Sœur Grace Kasongo',    date: '15 Mar 2025', duree: '18 min', type: 'Témoignage',   url: '#', thumbnail: thumbs[2] },
  { id: 4, titre: 'Les fondements de la prière',      orateur: 'Dr. Jean Mukendi',      date: '10 Mar 2025', duree: '45 min', type: 'Enseignement',  url: '#', thumbnail: thumbs[3] },
  { id: 5, titre: 'Identité en Christ',               orateur: 'David Mulumba',         date: '02 Mar 2025', duree: '38 min', type: 'Sermon',        url: '#', thumbnail: thumbs[4] },
  { id: 6, titre: 'Louange de l\'aube',               orateur: 'Emmanuel Tshiab',       date: '25 Fév 2025', duree: '30 min', type: 'Louange',       url: '#', thumbnail: thumbs[5] },
]

const emptyForm: Omit<Media, 'id'> = { titre: '', orateur: '', date: '', duree: '', type: 'Sermon', url: '', thumbnail: '' }

export default function AdminMedias() {
  const [medias, setMedias]       = useState<Media[]>(initialData)
  const [search, setSearch]       = useState('')
  const [filtreType, setFiltreType] = useState<'Tous' | TypeMedia>('Tous')
  const [modal, setModal]         = useState<'add' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected]   = useState<Media | null>(null)
  const [form, setForm]           = useState<Omit<Media, 'id'>>(emptyForm)

  const filtered = medias.filter((m) => {
    const matchSearch = m.titre.toLowerCase().includes(search.toLowerCase()) || m.orateur.toLowerCase().includes(search.toLowerCase())
    const matchType   = filtreType === 'Tous' || m.type === filtreType
    return matchSearch && matchType
  })

  function openAdd()             { setForm(emptyForm); setModal('add') }
  function openEdit(m: Media)    { setSelected(m); setForm({ titre: m.titre, orateur: m.orateur, date: m.date, duree: m.duree, type: m.type, url: m.url, thumbnail: m.thumbnail }); setModal('edit') }
  function openDelete(m: Media)  { setSelected(m); setModal('delete') }
  function closeModal()          { setModal(null); setSelected(null) }

  function handleSave() {
    if (modal === 'add') {
      setMedias([...medias, { id: Date.now(), ...form, thumbnail: thumbs[medias.length % thumbs.length] }])
    } else if (modal === 'edit' && selected) {
      setMedias(medias.map((m) => m.id === selected.id ? { ...m, ...form } : m))
    }
    closeModal()
  }

  function handleDelete() {
    if (selected) setMedias(medias.filter((m) => m.id !== selected.id))
    closeModal()
  }

  return (
    <>
      <Head title="Médias — Admin Phila MDT" />
      <AdminLayout title="Gestion des médias">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un média…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['Tous', 'Sermon', 'Louange', 'Témoignage', 'Enseignement'] as const).map((t) => (
              <button key={t} onClick={() => setFiltreType(t)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filtreType === t
                    ? 'bg-primary border-primary text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}>{t}</button>
            ))}
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} /> Ajouter
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group hover:border-slate-600 transition-colors">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img src={m.thumbnail} alt={m.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <Play size={20} className="text-white ml-0.5" fill="white" />
                  </div>
                </div>
                <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[m.type]}`}>
                  {m.type}
                </span>
              </div>
              {/* Info */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm leading-snug">{m.titre}</h3>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-slate-400 text-xs">{m.orateur}</p>
                    <p className="text-slate-500 text-xs">{m.date} · {m.duree}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => openDelete(m)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Add/Edit */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <h3 className="text-white font-bold">{modal === 'add' ? 'Ajouter un média' : 'Modifier le média'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Titre</label>
                  <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Orateur</label>
                  <input value={form.orateur} onChange={(e) => setForm({ ...form, orateur: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Date</label>
                  <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Durée</label>
                  <input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TypeMedia })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary">
                    {(['Sermon', 'Louange', 'Témoignage', 'Enseignement'] as TypeMedia[]).map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-slate-400 uppercase tracking-wider">URL YouTube / Lien vidéo</label>
                  <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://youtube.com/…"
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
                <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors">
                  <Check size={15} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer ce média</h3>
                <p className="text-slate-400 text-sm mt-1">Supprimer <strong className="text-white">{selected.titre}</strong> ?</p>
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
