import { Head, useForm, router } from '@inertiajs/react'
import { useRef, useState } from 'react'
import AdminLayout from '../../layouts/admin'
import {
  Image as ImageIcon, Video, Plus, Trash2,
  Eye, UploadCloud, FileVideo, FileImage, CheckCircle2, X
} from 'lucide-react'

interface Asset {
  id: number
  name: string
  filePath: string
  type: 'image' | 'video'
  status: 'active' | 'inactive'
  createdAt: string
}

export default function AdminAssets({ assets }: { assets: Asset[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [preview, setPreview] = useState<{ url: string; type: 'image' | 'video' } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    name: '',
    status: 'inactive' as 'active' | 'inactive',
    file: null as File | null,
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    form.setData('file', file)
    if (file) {
      // Auto-fill name from filename if empty
      if (!form.data.name) {
        form.setData('name', file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] ?? null
    if (file) {
      form.setData('file', file)
      if (!form.data.name) form.setData('name', file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.post('/admin/assets', {
      forceFormData: true,
      onSuccess: () => {
        setModalOpen(false)
        form.reset()
      }
    })
  }

  function handleActivate(id: number) {
    router.patch(`/admin/assets/${id}/activate`)
  }

  function handleDeactivate(id: number) {
    router.patch(`/admin/assets/${id}/deactivate`)
  }

  function handleDelete(id: number, name: string) {
    if (confirm(`Supprimer "${name}" ? Cette action supprimera aussi le fichier sur Cloudinary.`)) {
      router.delete(`/admin/assets/${id}`)
    }
  }

  const videoExtnames = ['mp4', 'webm', 'mov']

  return (
    <>
      <Head title="Assets Hero — Admin Phila MDT" />
      <AdminLayout title="Gestion des Assets (Hero Section)">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Médias de la Hero Section</h2>
            <p className="text-slate-400 text-sm mt-1">Gérez l'image ou la vidéo affichée en fond sur la page d'accueil.</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Ajouter un média
          </button>
        </div>

        {/* ── Grid of Assets ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`group relative bg-slate-900 border ${
                asset.status === 'active'
                  ? 'border-primary/50 ring-1 ring-primary/20'
                  : 'border-slate-800'
              } rounded-2xl overflow-hidden transition-all hover:translate-y-[-4px] shadow-xl`}
            >
              {/* Preview */}
              <div className="aspect-video bg-slate-950 flex items-center justify-center border-b border-slate-800 relative overflow-hidden">
                {asset.type === 'video' ? (
                  <video
                    src={asset.filePath}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={asset.filePath}
                    alt={asset.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg ${
                    asset.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {asset.status === 'active' ? 'En ligne' : 'Inactif'}
                  </span>
                </div>
                {/* Preview overlay button */}
                <button
                  onClick={() => setPreview({ url: asset.filePath, type: asset.type })}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye size={28} className="text-white drop-shadow" />
                </button>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  {asset.type === 'video'
                    ? <Video size={14} className="text-primary" />
                    : <ImageIcon size={14} className="text-blue-400" />}
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset.type}</span>
                </div>
                <h3 className="text-white font-bold truncate">{asset.name}</h3>
                <p className="text-slate-500 text-[11px] mt-1 italic">
                  Ajouté le {new Date(asset.createdAt).toLocaleDateString('fr-FR')}
                </p>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/50">
                  {asset.status === 'active' ? (
                    <button
                      onClick={() => handleDeactivate(asset.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:bg-slate-700 transition-all"
                    >
                      Désactiver
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(asset.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                    >
                      <CheckCircle2 size={14} /> Activer
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(asset.id, asset.name)}
                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add placeholder card */}
          <div
            onClick={() => setModalOpen(true)}
            className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-500 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud size={24} />
            </div>
            <span className="text-sm font-bold">Ajouter un nouveau média</span>
          </div>
        </div>

        {assets.length === 0 && (
          <div className="mt-6 text-center text-slate-500 text-sm">
            Aucun média pour l'instant. Commencez par en ajouter un.
          </div>
        )}

        {/* ── Upload Modal ──────────────────────────────────────── */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">Nouveau Média</h3>
                    <p className="text-slate-400 text-sm">Téléchargez un fichier image ou vidéo.</p>
                  </div>
                  <button
                    onClick={() => { setModalOpen(false); form.reset() }}
                    className="text-slate-500 hover:text-white p-1"
                  >
                    <X size={22} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* File Drop Zone */}
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-slate-950/50 hover:bg-slate-950 transition-colors cursor-pointer group ${
                      form.data.file ? 'border-primary/60' : 'border-slate-700'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {form.data.file ? (
                      <>
                        {videoExtnames.includes(form.data.file.name.split('.').pop()?.toLowerCase() ?? '') ? (
                          <FileVideo size={36} className="text-primary" />
                        ) : (
                          <FileImage size={36} className="text-primary" />
                        )}
                        <span className="text-sm text-white font-medium text-center break-all">{form.data.file.name}</span>
                        <span className="text-[10px] text-slate-500">{(form.data.file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud size={40} className="text-slate-600 group-hover:text-primary transition-colors" />
                        <span className="text-xs text-slate-400">Cliquez ou glissez un fichier ici</span>
                        <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">MP4, JPG, PNG, WEBP (Max 50MB)</span>
                      </>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Nom du média</label>
                    <input
                      value={form.data.name}
                      onChange={(e) => form.setData('name', e.target.value)}
                      required
                      placeholder="Ex: Fond Culte Dominical"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    />
                    {form.errors.name && <p className="text-red-400 text-[10px] mt-1">{form.errors.name}</p>}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Statut initial</label>
                    <select
                      value={form.data.status}
                      onChange={(e) => form.setData('status', e.target.value as 'active' | 'inactive')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="inactive">Inactif (Brouillon)</option>
                      <option value="active">Actif (Mise en ligne immédiate)</option>
                    </select>
                  </div>

                  {form.data.status === 'active' && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                      <span className="text-yellow-400 text-xs">⚠</span>
                      <p className="text-[11px] text-yellow-200/70">
                        Un seul média peut être actif à la fois. Activer ce média désactivera automatiquement l'actuel.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={form.processing || !form.data.file}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {form.processing ? 'Upload en cours...' : 'Commencer le téléchargement'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── Full Preview Modal ─────────────────────────────────── */}
        {preview && (
          <div
            className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <button className="absolute top-5 right-5 text-white/60 hover:text-white" onClick={() => setPreview(null)}>
              <X size={28} />
            </button>
            {preview.type === 'video' ? (
              <video src={preview.url} controls autoPlay className="max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
            ) : (
              <img src={preview.url} alt="Preview" className="max-w-4xl max-h-[85vh] object-contain rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
            )}
          </div>
        )}

      </AdminLayout>
    </>
  )
}
