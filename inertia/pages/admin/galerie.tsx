import { Head, useForm, router } from '@inertiajs/react'
import { useState, useRef, useEffect } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import CloudinaryImage from '../../components/CloudinaryImage'
import {
  Plus,
  Trash2,
  X,
  Check,
  Upload,
  Search,
  ImageIcon,
  FolderOpen,
  Tag,
  Calendar,
  Pencil,
  Eye,
  ArrowLeftRight
} from 'lucide-react'

interface CatGalery {
  id: number
  name: string
}

interface Galery {
  id: number
  title: string
  coverImg: string | null
  urlImg: string | null
  imgNber: number
  catGaleryId: number
  catGalery: CatGalery | null
  createdAt: string
}

interface Photo {
  id: number
  title: string | null
  url: string
  date: string | null
  galeryId: number
  galery: { id: number; title: string } | null
  createdAt: string
}

interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}

interface Props {
  tab: 'albums' | 'photos'
  galeries: Galery[]
  photos: Photo[]
  allGaleries: Array<{ id: number; title: string; catGaleryId: number }>
  categories: CatGalery[]
  meta: PaginationMeta
  filters: {
    search: string
    catId: string
    galeryId: string
    tab: 'albums' | 'photos'
  }
}

export default function AdminGalerie({
  tab: currentTab,
  galeries,
  photos,
  allGaleries,
  categories,
  meta,
  filters,
}: Props) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'albums' | 'photos'>(currentTab || 'albums')

  // Search and Filters States
  const [search, setSearch] = useState(filters.search || '')
  const [catFilter, setCatFilter] = useState(filters.catId || 'all')
  const [galeryFilter, setGaleryFilter] = useState(filters.galeryId || 'all')

  // Modals States
  const [albumModalOpen, setAlbumModalOpen] = useState(false)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const [catModalOpen, setCatModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<'album' | 'photo' | 'category' | null>(null)

  // Selection for edit/delete
  const [selectedAlbum, setSelectedAlbum] = useState<Galery | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedCat, setSelectedCat] = useState<CatGalery | null>(null)

  // Lightbox Image Zoom
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  // File preview references
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  // Inertia Forms
  const albumForm = useForm({
    title: '',
    catGaleryId: categories.length > 0 ? categories[0].id : 0,
    file: null as File | null,
  })

  const photoForm = useForm({
    title: '',
    galeryId: allGaleries.length > 0 ? allGaleries[0].id : 0,
    date: '',
    file: null as File | null,
  })

  const catForm = useForm({
    name: '',
  })

  // Trigger search or filter query
  function applyFilters(newParams: Partial<typeof filters> & { page?: number }) {
    const updated = {
      tab: activeTab,
      search,
      catId: catFilter,
      galeryId: galeryFilter,
      ...newParams,
    }

    router.get('/admin/galerie', updated, {
      preserveState: true,
      replace: true,
    })
  }

  // Handle Tab Switch
  function switchTab(newTab: 'albums' | 'photos') {
    setActiveTab(newTab)
    applyFilters({
      tab: newTab,
      page: 1, // reset page to 1 on tab switch
    })
  }

  // Search input bounce or enter triggers
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyFilters({ page: 1 })
    }
  }

  // Clear all filters
  function clearFilters() {
    setSearch('')
    setCatFilter('all')
    setGaleryFilter('all')
    router.get('/admin/galerie', { tab: activeTab, page: 1 })
  }

  // --- File Previews ---
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, type: 'album' | 'photo') {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
      if (type === 'album') {
        albumForm.setData('file', file)
      } else {
        photoForm.setData('file', file)
      }
    }
  }

  // --- Album Operations ---
  function openCreateAlbum() {
    setSelectedAlbum(null)
    albumForm.reset()
    albumForm.clearErrors()
    // Default to first category if available
    if (categories.length > 0) {
      albumForm.setData('catGaleryId', categories[0].id)
    }
    setPreviewUrl('')
    setAlbumModalOpen(true)
  }

  function openEditAlbum(g: Galery) {
    setSelectedAlbum(g)
    albumForm.clearErrors()
    albumForm.setData({
      title: g.title,
      catGaleryId: g.catGaleryId,
      file: null,
    })
    setPreviewUrl(g.coverImg || '')
    setAlbumModalOpen(true)
  }

  function submitAlbum(e: React.FormEvent) {
    e.preventDefault()

    if (selectedAlbum) {
      // Edit
      albumForm.post(`/admin/galerie/albums/${selectedAlbum.id}?_method=PUT`, {
        forceFormData: true,
        onSuccess: () => {
          setAlbumModalOpen(false)
          setSelectedAlbum(null)
          albumForm.reset()
        },
      })
    } else {
      // Create
      albumForm.post('/admin/galerie/albums', {
        forceFormData: true,
        onSuccess: () => {
          setAlbumModalOpen(false)
          albumForm.reset()
        },
      })
    }
  }

  function openDeleteAlbum(g: Galery) {
    setSelectedAlbum(g)
    setDeleteModal('album')
  }

  function confirmDeleteAlbum() {
    if (selectedAlbum) {
      router.delete(`/admin/galerie/albums/${selectedAlbum.id}`, {
        onSuccess: () => {
          setDeleteModal(null)
          setSelectedAlbum(null)
        },
      })
    }
  }

  // --- Photo (Image) Operations ---
  function openCreatePhoto() {
    setSelectedPhoto(null)
    photoForm.reset()
    photoForm.clearErrors()
    if (allGaleries.length > 0) {
      photoForm.setData('galeryId', allGaleries[0].id)
    }
    setPreviewUrl('')
    setPhotoModalOpen(true)
  }

  function openEditPhoto(p: Photo) {
    setSelectedPhoto(p)
    photoForm.clearErrors()
    photoForm.setData({
      title: p.title || '',
      galeryId: p.galeryId,
      date: p.date || '',
      file: null,
    })
    setPreviewUrl(p.url)
    setPhotoModalOpen(true)
  }

  function submitPhoto(e: React.FormEvent) {
    e.preventDefault()

    if (selectedPhoto) {
      // Edit
      photoForm.post(`/admin/galerie/photos/${selectedPhoto.id}?_method=PUT`, {
        forceFormData: true,
        onSuccess: () => {
          setPhotoModalOpen(false)
          setSelectedPhoto(null)
          photoForm.reset()
        },
      })
    } else {
      // Create
      photoForm.post('/admin/galerie/photos', {
        forceFormData: true,
        onSuccess: () => {
          setPhotoModalOpen(false)
          photoForm.reset()
        },
      })
    }
  }

  function openDeletePhoto(p: Photo) {
    setSelectedPhoto(p)
    setDeleteModal('photo')
  }

  function confirmDeletePhoto() {
    if (selectedPhoto) {
      router.delete(`/admin/galerie/photos/${selectedPhoto.id}`, {
        onSuccess: () => {
          setDeleteModal(null)
          setSelectedPhoto(null)
        },
      })
    }
  }

  // --- Category Operations ---
  function openCatModal() {
    setSelectedCat(null)
    catForm.reset()
    catForm.clearErrors()
    setCatModalOpen(true)
  }

  function startEditCategory(c: CatGalery) {
    setSelectedCat(c)
    catForm.setData('name', c.name)
    catForm.clearErrors()
  }

  function submitCategory(e: React.FormEvent) {
    e.preventDefault()

    if (selectedCat) {
      catForm.put(`/admin/galerie/categories/${selectedCat.id}`, {
        onSuccess: () => {
          setSelectedCat(null)
          catForm.reset()
        },
      })
    } else {
      catForm.post('/admin/galerie/categories', {
        onSuccess: () => {
          catForm.reset()
        },
      })
    }
  }

  function openDeleteCategory(c: CatGalery) {
    setSelectedCat(c)
    setDeleteModal('category')
  }

  function confirmDeleteCategory() {
    if (selectedCat) {
      router.delete(`/admin/galerie/categories/${selectedCat.id}`, {
        onSuccess: () => {
          setDeleteModal(null)
          setSelectedCat(null)
          catForm.reset()
        },
      })
    }
  }

  return (
    <>
      <Head title="Gestion de la Galerie — Admin Phila MDT" />
      <AdminLayout title="Gestion de la galerie">
        {/* Double-Tab Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => switchTab('albums')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all ${
                activeTab === 'albums'
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-md shadow-black/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FolderOpen size={18} className={activeTab === 'albums' ? 'text-primary' : 'text-slate-500'} />
              <span>Albums ({allGaleries.length})</span>
            </button>
            <button
              onClick={() => switchTab('photos')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all ${
                activeTab === 'photos'
                  ? 'bg-slate-900 text-white border border-slate-800 shadow-md shadow-black/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon size={18} className={activeTab === 'photos' ? 'text-primary' : 'text-slate-500'} />
              <span>Photos</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCatModal}
              className="flex items-center gap-2 border border-slate-800 hover:border-slate-700 bg-slate-950/20 text-slate-350 hover:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            >
              <Tag size={14} className="text-slate-500" />
              <span>Catégories ({categories.length})</span>
            </button>

            {activeTab === 'albums' ? (
              <button
                onClick={openCreateAlbum}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={16} />
                <span>Créer un album</span>
              </button>
            ) : (
              <button
                onClick={openCreatePhoto}
                disabled={allGaleries.length === 0}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                <span>Ajouter une photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Toolbar / Filters */}
        <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              placeholder={
                activeTab === 'albums'
                  ? 'Rechercher un album par titre ou catégorie...'
                  : 'Rechercher une photo par titre...'
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-colors font-semibold"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-52">
            <select
              value={catFilter}
              onChange={(e) => {
                setCatFilter(e.target.value)
                router.get(
                  '/admin/galerie',
                  { tab: activeTab, search, catId: e.target.value, galeryId: galeryFilter, page: 1 },
                  { preserveState: true }
                )
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-350 focus:outline-none focus:border-primary transition-colors font-bold uppercase tracking-wider"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Album Filter (Only in Photos tab) */}
          {activeTab === 'photos' && (
            <div className="w-full md:w-52">
              <select
                value={galeryFilter}
                onChange={(e) => {
                  setGaleryFilter(e.target.value)
                  router.get(
                    '/admin/galerie',
                    { tab: activeTab, search, catId: catFilter, galeryId: e.target.value, page: 1 },
                    { preserveState: true }
                  )
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-350 focus:outline-none focus:border-primary transition-colors font-bold uppercase tracking-wider"
              >
                <option value="all">Tous les albums</option>
                {allGaleries.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 w-full md:w-auto shrink-0">
            <button
              onClick={() => applyFilters({ page: 1 })}
              className="flex-1 md:flex-none justify-center px-5 py-3 rounded-xl text-xs font-black bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white transition-all"
            >
              Filtrer
            </button>
            {(search || catFilter !== 'all' || galeryFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-850 transition-colors"
                title="Réinitialiser les filtres"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* ── ALUBMS VIEW ────────────────────────────────────── */}
        {activeTab === 'albums' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {galeries.map((g) => (
                <div
                  key={g.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-xl flex flex-col h-full"
                >
                  {/* Album Cover */}
                  <div className="aspect-[4/3] bg-slate-950 flex items-center justify-center border-b border-slate-850 relative overflow-hidden shrink-0">
                    {g.coverImg ? (
                      <CloudinaryImage
                        src={g.coverImg}
                        width={400}
                        height={300}
                        alt={g.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center text-slate-750">
                        <FolderOpen size={48} className="opacity-10 mb-2" />
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-20">Aucune couverture</span>
                      </div>
                    )}

                    {/* Quick Category Tag overlay */}
                    {g.catGalery && (
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-slate-850 text-slate-300 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                        {g.catGalery.name}
                      </span>
                    )}

                    {/* Photos Counter Tag overlay */}
                    <span className="absolute bottom-3 right-3 bg-primary/95 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg">
                      {g.imgNber} {g.imgNber > 1 ? 'Photos' : 'Photo'}
                    </span>
                  </div>

                  {/* Album Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white text-sm font-black line-clamp-2 mt-1 mb-2 leading-relaxed">
                        {g.title}
                      </h4>
                      <p className="text-slate-500 text-[10px] font-bold">
                        Créé le {new Date(g.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center gap-1.5 border-t border-slate-850/50 pt-4 mt-4 justify-end">
                      <button
                        onClick={() => openEditAlbum(g)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-850 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => openDeleteAlbum(g)}
                        className="p-2 text-slate-400 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-slate-800 hover:border-red-950/20 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {galeries.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-slate-650 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl">
                <FolderOpen size={48} className="mb-4 opacity-20 text-primary" />
                <p className="font-bold text-sm">Aucun album trouvé</p>
                <p className="text-xs text-slate-500 mt-1">Essayez d'ajuster vos filtres ou créez votre premier album.</p>
              </div>
            )}
          </>
        )}

        {/* ── PHOTOS VIEW ────────────────────────────────────── */}
        {activeTab === 'photos' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all hover:-translate-y-1 shadow-lg flex flex-col h-full"
                >
                  {/* Photo Container */}
                  <div className="aspect-[4/3] bg-slate-950 relative overflow-hidden flex items-center justify-center shrink-0">
                    <CloudinaryImage
                      src={p.url}
                      width={300}
                      height={225}
                      alt={p.title || 'Photo'}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover mask */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setLightboxPhoto(p)}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg"
                        title="Zoomer"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => openEditPhoto(p)}
                        className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg"
                        title="Modifier"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => openDeletePhoto(p)}
                        className="w-9 h-9 rounded-xl bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-lg"
                        title="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white text-xs font-bold truncate">
                        {p.title || 'Sans titre'}
                      </h4>
                      {p.galery && (
                        <p className="text-slate-500 text-[10px] mt-1 font-semibold flex items-center gap-1.5 truncate">
                          <FolderOpen size={10} className="text-slate-600" />
                          <span>{p.galery.title}</span>
                        </p>
                      )}
                    </div>
                    {p.date && (
                      <p className="text-slate-600 text-[9px] mt-2 font-bold flex items-center gap-1">
                        <Calendar size={9} />
                        <span>{new Date(p.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {photos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-slate-650 bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl">
                <ImageIcon size={48} className="mb-4 opacity-20 text-primary" />
                <p className="font-bold text-sm">Aucune photo trouvée</p>
                <p className="text-xs text-slate-500 mt-1">Vous pouvez ajouter des photos à vos albums existants.</p>
              </div>
            )}
          </>
        )}

        {/* Global Pagination */}
        {meta.lastPage > 1 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl mt-8 overflow-hidden shadow-xl">
            <Pagination
              meta={meta}
              onPageChange={(page) => {
                applyFilters({ page })
              }}
            />
          </div>
        )}

        {/* ── MODAL : CREATE/EDIT ALBUM ────────────────────────── */}
        {albumModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                  {selectedAlbum ? 'Modifier l\'album' : 'Créer un album'}
                </h3>
                <button
                  onClick={() => setAlbumModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitAlbum} className="p-6 space-y-4">
                {/* Title */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Titre de l'album
                  </label>
                  <input
                    type="text"
                    required
                    value={albumForm.data.title}
                    onChange={(e) => albumForm.setData('title', e.target.value)}
                    placeholder="Ex: Culte d'action de grâce"
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors ${
                      albumForm.errors.title ? 'border-red-400' : 'border-slate-800'
                    }`}
                  />
                  {albumForm.errors.title && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{albumForm.errors.title}</p>
                  )}
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Catégorie d'album
                  </label>
                  <select
                    value={albumForm.data.catGaleryId}
                    onChange={(e) => albumForm.setData('catGaleryId', Number(e.target.value))}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-primary transition-colors ${
                      albumForm.errors.catGaleryId ? 'border-red-400' : 'border-slate-800'
                    }`}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {albumForm.errors.catGaleryId && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{albumForm.errors.catGaleryId}</p>
                  )}
                </div>

                {/* Image Cover File Upload */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Image de couverture
                  </label>
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 bg-slate-950/40 hover:bg-slate-950/70 group ${
                      (albumForm.errors as any).file ? 'border-red-400' : 'border-slate-800 hover:border-primary'
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                        {previewUrl.startsWith('blob:') || previewUrl.startsWith('data:') ? (
                          <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <CloudinaryImage src={previewUrl} width={400} height={300} alt="Cover preview" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={24} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-slate-500 group-hover:text-primary transition-colors" />
                        <p className="text-slate-400 text-xs font-bold text-center">
                          Cliquez pour choisir une couverture
                        </p>
                        <span className="text-[9px] text-slate-650 uppercase font-black tracking-widest">
                          Max 5Mo · JPG, PNG, WEBP
                        </span>
                      </>
                    )}
                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'album')}
                      className="hidden"
                    />
                  </div>
                  {(albumForm.errors as any).file && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{(albumForm.errors as any).file}</p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50 mt-6">
                  <button
                    type="button"
                    onClick={() => setAlbumModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-850 hover:bg-slate-850 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={albumForm.processing}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs bg-primary hover:bg-primary-dark text-white font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>{selectedAlbum ? 'Enregistrer' : 'Créer'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL : CREATE/EDIT PHOTO ────────────────────────── */}
        {photoModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                  {selectedPhoto ? 'Modifier la photo' : 'Ajouter des photos'}
                </h3>
                <button
                  onClick={() => setPhotoModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={submitPhoto} className="p-6 space-y-4">
                {/* Title (Optional) */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Titre / Légende (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={photoForm.data.title}
                    onChange={(e) => photoForm.setData('title', e.target.value)}
                    placeholder="Ex: Vue de l'assemblée"
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors ${
                      photoForm.errors.title ? 'border-red-400' : 'border-slate-800'
                    }`}
                  />
                  {photoForm.errors.title && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{photoForm.errors.title}</p>
                  )}
                </div>

                {/* Album Selection */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Album d'appartenance
                  </label>
                  <select
                    value={photoForm.data.galeryId}
                    onChange={(e) => photoForm.setData('galeryId', Number(e.target.value))}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-350 focus:outline-none focus:border-primary transition-colors ${
                      photoForm.errors.galeryId ? 'border-red-400' : 'border-slate-800'
                    }`}
                  >
                    {allGaleries.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                  {photoForm.errors.galeryId && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{photoForm.errors.galeryId}</p>
                  )}
                </div>

                {/* Date Input */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Date de prise (Optionnel)
                  </label>
                  <input
                    type="date"
                    value={photoForm.data.date}
                    onChange={(e) => photoForm.setData('date', e.target.value)}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors ${
                      photoForm.errors.date ? 'border-red-400' : 'border-slate-800'
                    }`}
                  />
                  {photoForm.errors.date && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{photoForm.errors.date}</p>
                  )}
                </div>

                {/* Photo File Upload */}
                <div>
                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-wider mb-2 block">
                    Sélectionner l'image
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 bg-slate-950/40 hover:bg-slate-950/70 group ${
                      (photoForm.errors as any).file ? 'border-red-400' : 'border-slate-800 hover:border-primary'
                    }`}
                  >
                    {previewUrl ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg border border-slate-800">
                        {previewUrl.startsWith('blob:') || previewUrl.startsWith('data:') ? (
                          <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <CloudinaryImage src={previewUrl} width={400} height={300} alt="Photo preview" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={24} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} className="text-slate-500 group-hover:text-primary transition-colors" />
                        <p className="text-slate-400 text-xs font-bold text-center">
                          Cliquez pour choisir un cliché
                        </p>
                        <span className="text-[9px] text-slate-650 uppercase font-black tracking-widest">
                          Max 10Mo · JPG, PNG, WEBP
                        </span>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photo')}
                      className="hidden"
                    />
                  </div>
                  {(photoForm.errors as any).file && (
                    <p className="text-red-400 text-xs mt-1 font-semibold">{(photoForm.errors as any).file}</p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/50 mt-6">
                  <button
                    type="button"
                    onClick={() => setPhotoModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white border border-slate-855 hover:bg-slate-850 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={photoForm.processing}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs bg-primary hover:bg-primary-dark text-white font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    <Check size={14} />
                    <span>{selectedPhoto ? 'Enregistrer' : 'Ajouter'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL : MANAGE CATEGORIES (Inline CRUD) ─────────── */}
        {catModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/20">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                  Catégories d'albums
                </h3>
                <button
                  onClick={() => setCatModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Form to Create/Edit inline */}
                <form onSubmit={submitCategory} className="flex gap-2.5 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={catForm.data.name}
                      onChange={(e) => catForm.setData('name', e.target.value)}
                      placeholder={selectedCat ? 'Renommer la catégorie...' : 'Nom de la nouvelle catégorie...'}
                      className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors ${
                        catForm.errors.name ? 'border-red-400' : 'border-slate-800'
                      }`}
                    />
                    {catForm.errors.name && (
                      <p className="text-red-400 text-xs mt-1 font-semibold">{catForm.errors.name}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={catForm.processing}
                    className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl text-xs bg-primary hover:bg-primary-dark text-white font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50 shrink-0"
                  >
                    {selectedCat ? <Check size={14} /> : <Plus size={14} />}
                    <span>{selectedCat ? 'Ok' : 'Créer'}</span>
                  </button>
                  {selectedCat && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCat(null)
                        catForm.reset()
                      }}
                      className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </form>

                {/* Categories List */}
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors"
                    >
                      <span className="text-slate-200 text-xs font-black flex items-center gap-2 uppercase tracking-wider">
                        <Tag size={12} className="text-slate-500" />
                        <span>{cat.name}</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => openDeleteCategory(cat)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={12} />
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

        {/* ── LIGHTBOX : ZOOM IMAGE ───────────────────────────── */}
        {lightboxPhoto && (
          <div
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-900 border border-slate-850 p-3 rounded-2xl shadow-xl transition-all"
            >
              <X size={20} />
            </button>
            <div className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center">
              <CloudinaryImage
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title || ''}
                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-slate-900 animate-in zoom-in-95 duration-200"
              />
              {lightboxPhoto.title && (
                <p className="text-white text-sm font-black text-center mt-4 bg-slate-900/60 backdrop-blur-md px-5 py-2.5 rounded-xl border border-slate-800 max-w-lg truncate">
                  {lightboxPhoto.title}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── MODALS : DELETE CONFIRMATION ────────────────────── */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                  {deleteModal === 'album'
                    ? 'Supprimer l\'album'
                    : deleteModal === 'photo'
                    ? 'Supprimer la photo'
                    : 'Supprimer la catégorie'}
                </h3>
                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                  {deleteModal === 'album' && selectedAlbum ? (
                    <>
                      Êtes-vous sûr de vouloir supprimer l'album <strong className="text-white">{selectedAlbum.title}</strong> ?
                      <br />
                      <span className="text-red-400 font-bold block mt-2">
                        ⚠️ Cette action supprimera également toutes les photos contenues dans cet album physiquement sur Cloudinary.
                      </span>
                    </>
                  ) : deleteModal === 'photo' && selectedPhoto ? (
                    <>
                      Voulez-vous supprimer cette photo ? Elle sera détruite définitivement de votre stockage Cloudinary.
                    </>
                  ) : (
                    selectedCat && (
                      <>
                        Voulez-vous supprimer la catégorie d'album <strong className="text-white">{selectedCat.name}</strong> ?
                      </>
                    )
                  )}
                </p>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-850">
                <button
                  onClick={() => {
                    setDeleteModal(null)
                    setSelectedAlbum(null)
                    setSelectedPhoto(null)
                    setSelectedCat(null)
                  }}
                  className="flex-1 py-3 rounded-xl border border-slate-800 text-slate-350 hover:bg-slate-850 text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={
                    deleteModal === 'album'
                      ? confirmDeleteAlbum
                      : deleteModal === 'photo'
                      ? confirmDeletePhoto
                      : confirmDeleteCategory
                  }
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black transition-all shadow-lg shadow-red-500/10"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
