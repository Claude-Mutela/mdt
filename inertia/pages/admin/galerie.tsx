import { Head } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { Plus, Trash2, X, Check, Upload, Search, ImageIcon } from 'lucide-react'

interface Photo {
  id: number
  titre: string
  categorie: string
  date: string
  src: string
}

const CATEGORIES = ['Toutes', 'Culte', 'Événement', 'Jeunesse', 'Louange', 'Social']

const initialData: Photo[] = [
  { id: 1,  titre: 'Culte du dimanche',            categorie: 'Culte',     date: '30 Mar 2025', src: 'https://images.unsplash.com/photo-1438232992991-995b671e4a14?q=80&w=600&auto=format&fit=crop' },
  { id: 2,  titre: 'Aksanti Mungu 2025',            categorie: 'Événement', date: '22 Mar 2025', src: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop' },
  { id: 3,  titre: 'Génération PHILA - Réunion',   categorie: 'Jeunesse',  date: '15 Mar 2025', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
  { id: 4,  titre: 'Intercession nationale',        categorie: 'Culte',     date: '08 Mar 2025', src: 'https://images.unsplash.com/photo-1519677584237-752f8853252e?q=80&w=600&auto=format&fit=crop' },
  { id: 5,  titre: 'Chorale en répétition',         categorie: 'Louange',   date: '01 Mar 2025', src: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=600&auto=format&fit=crop' },
  { id: 6,  titre: 'Action sociale - Distribution', categorie: 'Social',    date: '22 Fév 2025', src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=600&auto=format&fit=crop' },
  { id: 7,  titre: 'Baptêmes 2025',                 categorie: 'Culte',     date: '15 Fév 2025', src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop' },
  { id: 8,  titre: 'Camp de jeunesse',              categorie: 'Jeunesse',  date: '08 Fév 2025', src: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600&auto=format&fit=crop' },
  { id: 9,  titre: 'Nuit de prière',                categorie: 'Culte',     date: '01 Fév 2025', src: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=600&auto=format&fit=crop' },
]

const emptyForm: Omit<Photo, 'id' | 'src'> = { titre: '', categorie: 'Culte', date: '' }

export default function AdminGalerie() {
  const [photos, setPhotos]         = useState<Photo[]>(initialData)
  const [search, setSearch]         = useState('')
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes')
  const [modal, setModal]           = useState<'add' | 'delete' | null>(null)
  const [selected, setSelected]     = useState<Photo | null>(null)
  const [form, setForm]             = useState<Omit<Photo, 'id' | 'src'>>(emptyForm)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const fileRef                     = useRef<HTMLInputElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 15

  const filtered = photos.filter((p) => {
    const matchSearch = p.titre.toLowerCase().includes(search.toLowerCase())
    const matchCat    = filtreCategorie === 'Toutes' || p.categorie === filtreCategorie
    return matchSearch && matchCat
  })

  const total = filtered.length
  const lastPage = Math.ceil(total / perPage)
  const paginatedData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  const meta = {
    total,
    perPage,
    currentPage,
    lastPage,
    firstPage: 1
  }

  function openAdd()             { setForm(emptyForm); setPreviewUrl(''); setModal('add') }
  function openDelete(p: Photo)  { setSelected(p); setModal('delete') }
  function closeModal()          { setModal(null); setSelected(null); setPreviewUrl('') }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  function handleSave() {
    setPhotos([...photos, {
      id: Date.now(),
      ...form,
      src: previewUrl || `https://images.unsplash.com/photo-1519677584237-752f8853252e?q=80&w=600&auto=format&fit=crop`,
    }])
    closeModal()
  }

  function handleDelete() {
    if (selected) setPhotos(photos.filter((p) => p.id !== selected.id))
    closeModal()
  }

  return (
    <>
      <Head title="Galerie — Admin Phila MDT" />
      <AdminLayout title="Gestion de la galerie">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une photo…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => { setFiltreCategorie(c); setCurrentPage(1); }}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  filtreCategorie === c
                    ? 'bg-primary border-primary text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}>{c}</button>
            ))}
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
            <Plus size={16} /> Ajouter une photo
          </button>
        </div>

        {/* Photo Grid */}
        <div className="columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4 mb-8">
          {paginatedData.map((p) => (
            <div key={p.id} className="break-inside-avoid group relative rounded-xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-colors shadow-lg">
              <img src={p.src} alt={p.titre} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold leading-snug">{p.titre}</p>
                <p className="text-slate-300 text-[10px] mt-0.5">{p.categorie} · {p.date}</p>
                <button onClick={() => openDelete(p)} className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-red-500/80 flex items-center justify-center text-white hover:bg-red-600 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <ImageIcon size={40} className="mb-3 opacity-30" />
            <p>Aucune photo trouvée</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <Pagination meta={meta} onPageChange={(p) => setCurrentPage(p)} />
          </div>
        )}

        {/* Modal Add (identique) */}
        {modal === 'add' && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-bold">Ajouter une photo</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div onClick={() => fileRef.current?.click()} className="relative border-2 border-dashed border-slate-700 hover:border-primary rounded-xl p-6 cursor-pointer transition-colors flex flex-col items-center gap-2 group bg-slate-950/30">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="w-full h-40 object-cover rounded-lg shadow-lg" />
                  ) : (
                    <>
                      <Upload size={24} className="text-slate-500 group-hover:text-primary transition-colors" />
                      <p className="text-slate-400 text-sm">Cliquer pour choisir une image</p>
                      <p className="text-slate-600 text-xs tracking-tighter uppercase font-bold">JPG, PNG, WebP</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Titre</label>
                  <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Catégorie</label>
                    <select value={form.categorie} onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-primary transition-colors">
                      {CATEGORIES.filter(c => c !== 'Toutes').map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Date</label>
                    <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800">
                <button onClick={closeModal} className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 transition-colors">Annuler</button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-semibold transition-colors shadow-lg shadow-primary/20">
                  <Check size={15} /> Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {modal === 'delete' && selected && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg">Supprimer cette photo</h3>
                <p className="text-slate-400 text-sm mt-1">Supprimer <strong className="text-white">{selected.titre}</strong> de la galerie ?</p>
              </div>
              <div className="flex gap-3 mt-4">
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
