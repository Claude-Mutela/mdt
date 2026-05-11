import { Head } from '@inertiajs/react'
import { useState } from 'react'
import AdminLayout from '../../layouts/admin'
import { 
  Image as ImageIcon, Video, Plus, Trash2, 
  Eye, CheckCircle2, AlertCircle, UploadCloud,
  FileVideo, FileImage
} from 'lucide-react'

interface Asset {
  id: number
  type: 'image' | 'video'
  name: string
  url: string
  status: 'active' | 'inactive'
  createdAt: string
}

const initialAssets: Asset[] = [
  { id: 1, type: 'video', name: 'Fond Accueil Phila.mp4', url: '#', status: 'active', createdAt: '2024-05-10' },
  { id: 2, type: 'image', name: 'Background_Hero.jpg', url: '#', status: 'inactive', createdAt: '2024-05-08' },
]

export default function AdminAssets() {
  const [assets, setAssets] = useState<Asset[]>(initialAssets)
  const [modalOpen, setModalOpen] = useState(false)

  const toggleStatus = (id: number) => {
    setAssets(assets.map(a => 
      a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a
    ))
  }

  return (
    <>
      <Head title="Assets Hero — Admin Phila MDT" />
      <AdminLayout title="Gestion des Assets (Hero Section)">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Médias de la Hero Section</h2>
            <p className="text-slate-400 text-sm mt-1">Gérez l'image ou la vidéo qui s'affiche en fond sur la page d'accueil.</p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Ajouter un média
          </button>
        </div>

        {/* ── Grid of Assets ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className={`group relative bg-slate-900 border ${asset.status === 'active' ? 'border-primary/50 ring-1 ring-primary/20' : 'border-slate-800'} rounded-2xl overflow-hidden transition-all hover:translate-y-[-4px] shadow-xl`}>
              
              {/* Preview Placeholder */}
              <div className="aspect-video bg-slate-950 flex items-center justify-center border-b border-slate-800 relative group-hover:bg-slate-900 transition-colors">
                {asset.type === 'video' ? (
                  <FileVideo size={48} className="text-slate-700" />
                ) : (
                  <FileImage size={48} className="text-slate-700" />
                )}
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg ${
                    asset.status === 'active' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {asset.status === 'active' ? 'En ligne' : 'Inactif'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-1">
                  {asset.type === 'video' ? <Video size={14} className="text-primary" /> : <ImageIcon size={14} className="text-blue-400" />}
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{asset.type}</span>
                </div>
                <h3 className="text-white font-bold truncate">{asset.name}</h3>
                <p className="text-slate-500 text-[11px] mt-1 italic">Ajouté le {new Date(asset.createdAt).toLocaleDateString('fr-FR')}</p>

                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-800/50">
                  <button 
                    onClick={() => toggleStatus(asset.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      asset.status === 'active' 
                        ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {asset.status === 'active' ? 'Désactiver' : 'Activer'}
                  </button>
                  <button className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add Placeholder */}
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

        {/* ── Add Modal (Simplified) ──────────────────────────── */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white">Nouveau Média</h3>
                    <p className="text-slate-400 text-sm">Téléchargez un fichier image ou vidéo.</p>
                  </div>
                  <button onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-white p-1">
                    <Plus size={24} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 bg-slate-950/50 hover:bg-slate-950 transition-colors cursor-pointer group">
                    <UploadCloud size={40} className="text-slate-600 group-hover:text-primary transition-colors" />
                    <span className="text-xs text-slate-400">Cliquez ou glissez un fichier ici</span>
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">MP4, JPG, PNG (Max 50MB)</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Statut initial</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary">
                      <option value="inactive">Inactif (Brouillon)</option>
                      <option value="active">Actif (Mise en ligne immédiate)</option>
                    </select>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                    <AlertCircle size={18} className="text-yellow-500 shrink-0" />
                    <p className="text-[11px] text-yellow-200/70">
                      Un seul média peut être actif à la fois pour la Hero Section. Activer ce média désactivera automatiquement l'actuel.
                    </p>
                  </div>

                  <button className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 mt-4">
                    Commencer le téléchargement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </AdminLayout>
    </>
  )
}
