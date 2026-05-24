import { Head, useForm, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import CloudinaryImage from '../../components/CloudinaryImage'
import {
  Plus, Search, Pencil, Trash2, X, Check,
  Play, Tag, FileText, Music, Mic, Video, Link, CalendarDays, Clock, User2, Upload
} from 'lucide-react'

type FormatMedia = 'audio' | 'video' | 'texte' | 'podcast'

interface CatMedia {
  id: number
  name: string
}

interface Media {
  id: number
  title: string
  format: FormatMedia
  file: string | null
  urlFile: string | null
  orateur: string | null
  duration: number | null // en secondes
  date: string | null // "YYYY-MM-DD"
  catMediaId: number
  catMedia: CatMedia | null
  createdAt: string
}

interface AdminMediasProps {
  medias: Media[]
  categories: CatMedia[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
  filters: {
    search: string
    catId: string
  }
}

const formatColors: Record<FormatMedia, string> = {
  video:   'bg-red-500/10 text-red-400 border-red-500/20',
  audio:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  podcast: 'bg-green-500/10 text-green-400 border-green-500/20',
  texte:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
}

const formatLabels: Record<FormatMedia, string> = {
  video:   'Vidéo',
  audio:   'Audio',
  podcast: 'Podcast',
  texte:   'Document',
}

function getYoutubeId(url: string | null): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

function getYoutubeThumbnail(url: string | null): string | null {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export default function AdminMedias({ medias, categories, meta, filters }: AdminMediasProps) {
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | 'category' | null>(null)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [selectedCat, setSelectedCat] = useState<CatMedia | null>(null)
  const [searchFilter, setSearchFilter] = useState(filters.search || '')
  const [catFilter, setCatFilter] = useState(filters.catId || 'all')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [playingMedia, setPlayingMedia] = useState<Media | null>(null)

  function handlePlayMedia(m: Media) {
    if (m.format === 'texte') {
      const link = m.file || m.urlFile
      if (link) {
        window.open(link, '_blank')
      }
      return
    }
    setPlayingMedia(m)
  }

  // Media Category Form
  const catForm = useForm({
    name: '',
  })

  // Media Form
  const mediaForm = useForm({
    title: '',
    format: 'video' as FormatMedia,
    orateur: '',
    durationMin: '', // Saisie utilisateur en minutes pour plus de simplicité
    date: '',
    catMediaId: categories.length > 0 ? categories[0].id : 0,
    urlFile: '',
    file: null as File | null,
  })

  // Search & Filter change handlers
  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setSearchFilter(val)
    applyFilters(val, catFilter)
  }

  function handleCatFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setCatFilter(val)
    applyFilters(searchFilter, val)
  }

  function applyFilters(search: string, catId: string) {
    router.get(
      '/admin/medias',
      { search, catId, page: 1 },
      { preserveState: true, replace: true }
    )
  }

  function handlePageChange(page: number) {
    router.get(
      '/admin/medias',
      { search: searchFilter, catId: catFilter, page },
      { preserveState: true }
    )
  }

  // Medias CRUD Actions
  function openAdd() {
    mediaForm.reset()
    if (categories.length > 0) {
      mediaForm.setData({
        title: '',
        format: 'video',
        orateur: '',
        durationMin: '',
        date: '',
        catMediaId: categories[0].id,
        urlFile: '',
        file: null,
      })
    }
    setModal('add')
  }

  function openEdit(m: Media) {
    setSelectedMedia(m)
    mediaForm.setData({
      title: m.title,
      format: m.format,
      orateur: m.orateur || '',
      durationMin: m.duration ? String(Math.round(m.duration / 60)) : '',
      date: m.date || '',
      catMediaId: m.catMediaId,
      urlFile: m.urlFile || '',
      file: null,
    })
    setModal('edit')
  }

  function openDelete(m: Media) {
    setSelectedMedia(m)
    setModal('delete')
  }

  function closeModal() {
    setModal(null)
    setSelectedMedia(null)
    setSelectedCat(null)
    mediaForm.reset()
    catForm.reset()
  }

  function handleSaveMedia(e: React.FormEvent) {
    e.preventDefault()

    // Conversion des minutes saisies en secondes avant d'envoyer
    const durationSec = mediaForm.data.durationMin ? Number(mediaForm.data.durationMin) * 60 : null

    const dataToSend = {
      title: mediaForm.data.title,
      format: mediaForm.data.format,
      orateur: mediaForm.data.orateur || undefined,
      duration: durationSec || undefined,
      date: mediaForm.data.date || undefined,
      catMediaId: mediaForm.data.catMediaId,
      urlFile: mediaForm.data.urlFile || undefined,
      file: mediaForm.data.file,
    }

    if (modal === 'add') {
      router.post('/admin/medias', dataToSend as any, {
        forceFormData: true,
        onSuccess: () => closeModal(),
      })
    } else if (modal === 'edit' && selectedMedia) {
      // Spoofing PUT payload
      router.post(`/admin/medias/${selectedMedia.id}?_method=PUT`, dataToSend as any, {
        forceFormData: true,
        onSuccess: () => closeModal(),
      })
    }
  }

  function handleDeleteMedia() {
    if (selectedMedia) {
      router.delete(`/admin/medias/${selectedMedia.id}`, {
        onSuccess: () => closeModal(),
      })
    }
  }

  // Categories CRUD Actions
  function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault()
    if (selectedCat) {
      router.put(`/admin/medias/categories/${selectedCat.id}`, { name: catForm.data.name }, {
        onSuccess: () => {
          setSelectedCat(null)
          catForm.reset()
        }
      })
    } else {
      router.post('/admin/medias/categories', { name: catForm.data.name }, {
        onSuccess: () => catForm.reset()
      })
    }
  }

  function startEditCategory(cat: CatMedia) {
    setSelectedCat(cat)
    catForm.setData('name', cat.name)
  }

  function handleDeleteCategory(cat: CatMedia) {
    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
      router.delete(`/admin/medias/categories/${cat.id}`)
    }
  }

  function getFormatIcon(format: FormatMedia, size = 18) {
    switch (format) {
      case 'video': return <Video size={size} />
      case 'audio': return <Music size={size} />
      case 'podcast': return <Mic size={size} />
      case 'texte': return <FileText size={size} />
    }
  }

  return (
    <>
      <Head title="Médias — Admin Phila MDT" />
      <AdminLayout title="Gestion de la Médiathèque">

        {/* ── Header Toolbar ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          <div className="flex flex-col md:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={searchFilter}
                onChange={handleSearchChange}
                placeholder="Rechercher par titre ou orateur..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Category Select Filter */}
            <div className="w-full md:w-56">
              <select
                value={catFilter}
                onChange={handleCatFilterChange}
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setModal('category')}
              className="flex items-center gap-2 bg-slate-850 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Tag size={16} /> Catégories
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
            >
              <Plus size={18} /> Ajouter un média
            </button>
          </div>
        </div>

        {/* ── Grid of Medias ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {medias.map((m) => (
            <div
              key={m.id}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-xl flex flex-col h-full"
            >
              {/* Media Thumbnail */}
              <div
                onClick={() => handlePlayMedia(m)}
                className="aspect-video bg-slate-950 flex items-center justify-center border-b border-slate-800 relative overflow-hidden shrink-0 cursor-pointer animate-none"
              >
                {m.file ? (
                  // Cloudinary media file
                  m.format === 'video' ? (
                    <video src={m.file} className="w-full h-full object-cover opacity-70 group-hover:opacity-90" muted preload="metadata" />
                  ) : (
                    <CloudinaryImage src={m.file} width={400} height={225} alt={m.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  )
                ) : m.urlFile && getYoutubeThumbnail(m.urlFile) ? (
                  // YouTube Video Thumbnail cover
                  <img
                    src={getYoutubeThumbnail(m.urlFile)!}
                    alt={m.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  // Fallback beautiful graphic
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-600 group-hover:text-primary transition-colors">
                    {getFormatIcon(m.format, 36)}
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{formatLabels[m.format]}</span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-lg ${formatColors[m.format]}`}>
                    {formatLabels[m.format]}
                  </span>
                </div>

                {m.urlFile && (
                  <div className="absolute top-3 right-3" title="Lien externe">
                    <span className="bg-slate-900/80 border border-slate-700 text-slate-400 p-1.5 rounded-lg flex items-center justify-center shadow-lg">
                      <Link size={12} />
                    </span>
                  </div>
                )}

                {/* Overlay Play Indicator */}
                {m.format !== 'texte' && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play size={20} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info Body */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag size={12} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate">
                      {m.catMedia ? m.catMedia.name : 'Sans catégorie'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2" title={m.title}>
                    {m.title}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-end justify-between">
                  <div className="space-y-1">
                    {m.orateur && (
                      <p className="text-slate-400 text-xs font-semibold flex items-center gap-1.5">
                        <User2 size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate max-w-[150px]">{m.orateur}</span>
                      </p>
                    )}
                    <p className="text-slate-500 text-[10px] flex items-center gap-1.5">
                      <CalendarDays size={11} className="text-slate-600 shrink-0" />
                      <span>{m.date ? new Date(m.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Date non définie'}</span>
                      {m.duration && (
                        <>
                          <span className="text-slate-700">•</span>
                          <Clock size={11} className="text-slate-600 shrink-0" />
                          <span>{Math.round(m.duration / 60)} min</span>
                        </>
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950/40 p-1 border border-slate-800 rounded-xl shrink-0">
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => openDelete(m)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add placeholder card */}
          <div
            onClick={openAdd}
            className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group min-h-[260px]"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Ajouter un nouveau média</span>
            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-black">Audio, vidéo, podcast, texte</p>
          </div>
        </div>

        {/* Empty State */}
        {medias.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm shadow-xl">
            Aucun média pour l'instant avec ces critères. Commencez par en ajouter un.
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────────── */}
        {meta.lastPage > 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <Pagination meta={meta} onPageChange={handlePageChange} />
          </div>
        )}

        {/* ── Modal: Add / Edit Media ────────────────────────── */}
        {(modal === 'add' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-950/20">
                <h3 className="text-white text-lg font-black">{modal === 'add' ? 'Ajouter un Média' : 'Modifier le Média'}</h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveMedia} className="p-8 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                {/* Title */}
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Titre du média <span className="text-red-500">*</span></label>
                  <input
                    value={mediaForm.data.title}
                    onChange={(e) => mediaForm.setData('title', e.target.value)}
                    required
                    placeholder="Ex: La puissance du Saint-Esprit"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  />
                  {mediaForm.errors.title && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Format */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Format du média <span className="text-red-500">*</span></label>
                    <select
                      value={mediaForm.data.format}
                      onChange={(e) => mediaForm.setData('format', e.target.value as FormatMedia)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="video">Vidéo</option>
                      <option value="audio">Audio</option>
                      <option value="podcast">Podcast</option>
                      <option value="texte">Texte/Document</option>
                    </select>
                    {mediaForm.errors.format && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.format}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Catégorie <span className="text-red-500">*</span></label>
                    <select
                      value={mediaForm.data.catMediaId}
                      onChange={(e) => mediaForm.setData('catMediaId', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <option value={0}>Aucune catégorie</option>
                      )}
                    </select>
                    {mediaForm.errors.catMediaId && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.catMediaId}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Orateur */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Orateur / Prédicateur</label>
                    <input
                      value={mediaForm.data.orateur}
                      onChange={(e) => mediaForm.setData('orateur', e.target.value)}
                      placeholder="Ex: Pasteur Blonsky MBALA"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    />
                    {mediaForm.errors.orateur && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.orateur}</p>}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Date du média</label>
                    <input
                      type="date"
                      value={mediaForm.data.date}
                      onChange={(e) => mediaForm.setData('date', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors animate-none"
                    />
                    {mediaForm.errors.date && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.date}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Duration in Minutes */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Durée (en minutes)</label>
                    <input
                      type="number"
                      min={0}
                      value={mediaForm.data.durationMin}
                      onChange={(e) => mediaForm.setData('durationMin', e.target.value)}
                      placeholder="Ex: 52"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    />
                    {(mediaForm.errors as any).duration && <p className="text-red-400 text-xs mt-1">{(mediaForm.errors as any).duration}</p>}
                  </div>

                  {/* External URL File */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Lien YouTube / Externe</label>
                    <input
                      value={mediaForm.data.urlFile}
                      onChange={(e) => mediaForm.setData('urlFile', e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    />
                    {mediaForm.errors.urlFile && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.urlFile}</p>}
                  </div>
                </div>

                {/* File Upload (Cloudinary) */}
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block flex items-center gap-2">
                    Fichier média (Audio, Vidéo, Miniature ou PDF)
                  </label>
                  <div className="flex gap-4 items-center">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex-1 h-28 border border-dashed ${mediaForm.errors.file ? 'border-red-500 bg-red-500/5' : 'border-slate-800 hover:border-primary bg-slate-950/20'} rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={e => mediaForm.setData('file', e.target.files ? e.target.files[0] : null)}
                      />
                      <Upload size={20} className="text-slate-500 group-hover:text-primary transition-colors" />
                      <span className="text-[11px] text-slate-400 mt-2 text-center px-4 truncate w-full">
                        {mediaForm.data.file ? mediaForm.data.file.name : 'Cliquez pour uploader (JPG, MP3, MP4, PDF...)'}
                      </span>
                    </div>
                  </div>
                  {mediaForm.errors.file && <p className="text-red-400 text-xs mt-1">{mediaForm.errors.file}</p>}
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
                    disabled={mediaForm.processing}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <Check size={16} /> {mediaForm.processing ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Delete Media ────────────────────────────── */}
        {modal === 'delete' && selectedMedia && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-black text-lg">Supprimer ce média</h3>
                <p className="text-slate-450 text-sm mt-1">Êtes-vous sûr de vouloir supprimer <strong className="text-white">"{selectedMedia.title}"</strong> ?</p>
                <p className="text-slate-500 text-[11px] mt-2">Cette action supprimera également le fichier physique stocké sur Cloudinary.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-semibold transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteMedia}
                  className="flex-grow py-3 rounded-xl bg-red-500 hover:bg-red-650 text-white text-sm font-bold transition-all shadow-lg shadow-red-500/20"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal: Categories CRUD Manager ─────────────────── */}
        {modal === 'category' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-950/20">
                <h3 className="text-white text-lg font-black flex items-center gap-2"><Tag size={18} className="text-primary" /> Catégories des Médias</h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors"><X size={20} /></button>
              </div>

              <div className="p-8">
                {/* Form Add / Edit */}
                <form onSubmit={handleSaveCategory} className="flex gap-2 mb-6">
                  <div className="flex-1">
                    <input
                      value={catForm.data.name}
                      onChange={(e) => catForm.setData('name', e.target.value)}
                      required
                      placeholder={selectedCat ? "Modifier le nom..." : "Nouvelle catégorie..."}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-all"
                    />
                    {catForm.errors.name && <p className="text-red-400 text-xs mt-1">{catForm.errors.name}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={catForm.processing}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-sm bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 shrink-0"
                  >
                    {selectedCat ? <Check size={16} /> : <Plus size={16} />}
                    <span>{selectedCat ? 'Ok' : 'Créer'}</span>
                  </button>
                  {selectedCat && (
                    <button
                      type="button"
                      onClick={() => { setSelectedCat(null); catForm.reset() }}
                      className="px-3 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </form>

                {/* List Categories */}
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors"
                    >
                      <span className="text-slate-200 text-sm font-semibold flex items-center gap-2">
                        <Tag size={13} className="text-slate-500" /> {cat.name}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <p className="text-slate-500 text-xs text-center py-4">Aucune catégorie pour l'instant.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Playback Modal ────────────────────────────────── */}
        {playingMedia && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-850 bg-slate-950/20">
                <div>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest">
                    Lecture en cours · {formatLabels[playingMedia.format]}
                  </span>
                  <h3 className="text-white text-base font-black truncate max-w-xl md:max-w-2xl mt-0.5">{playingMedia.title}</h3>
                </div>
                <button onClick={() => setPlayingMedia(null)} className="text-slate-400 hover:text-white transition-colors bg-slate-850 p-2 rounded-xl border border-slate-800"><X size={20} /></button>
              </div>

              {/* Player Container */}
              <div className="aspect-video w-full bg-black flex items-center justify-center relative">
                {playingMedia.format === 'video' && playingMedia.urlFile && getYoutubeId(playingMedia.urlFile) ? (
                  // YouTube Video Player
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(playingMedia.urlFile)}?autoplay=1`}
                    title={playingMedia.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : playingMedia.format === 'video' && playingMedia.file ? (
                  // Cloudinary Video Player
                  <video
                    src={playingMedia.file}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  ></video>
                ) : (playingMedia.format === 'audio' || playingMedia.format === 'podcast') ? (
                  // Audio Player with beautiful poster
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-950 relative">
                    {/* Poster background blur */}
                    <div className="absolute inset-0 opacity-20 filter blur-3xl pointer-events-none">
                      {playingMedia.file ? (
                        <CloudinaryImage src={playingMedia.file} width={200} height={200} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600"></div>
                      )}
                    </div>

                    <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl mb-6 relative z-10 animate-pulse">
                      {playingMedia.format === 'podcast' ? <Mic size={48} className="text-primary" /> : <Music size={48} className="text-primary" />}
                    </div>

                    <p className="text-white text-lg font-bold text-center relative z-10 px-6 max-w-lg truncate">{playingMedia.title}</p>
                    {playingMedia.orateur && <p className="text-slate-400 text-sm font-semibold text-center relative z-10 mt-1">{playingMedia.orateur}</p>}

                    <audio
                      src={playingMedia.file || playingMedia.urlFile || undefined}
                      controls
                      autoPlay
                      className="w-full max-w-xl mt-8 relative z-10"
                    ></audio>
                  </div>
                ) : (
                  // Fallback
                  <div className="text-slate-500 text-sm">Le format du média ne peut pas être lu directement.</div>
                )}
              </div>

              {/* Modal Footer Info */}
              {playingMedia.orateur && (
                <div className="px-8 py-5 border-t border-slate-850 bg-slate-950/20 flex flex-wrap gap-6 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <User2 size={16} className="text-slate-500" />
                    <span className="font-semibold text-slate-350">{playingMedia.orateur}</span>
                  </div>
                  {playingMedia.date && (
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-slate-500" />
                      <span>{new Date(playingMedia.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </AdminLayout>
    </>
  )
}
