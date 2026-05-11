import { Link } from '@inertiajs/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  meta?: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
  }
  links?: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  onPageChange?: (page: number) => void // Pour les pages frontend-only
}

export default function Pagination({ meta, links, onPageChange }: PaginationProps) {
  // Si pas de données, on n'affiche rien
  if (!meta || meta.lastPage <= 1) return null

  // Rendu pour la pagination locale (frontend only)
  if (onPageChange && !links) {
    const pages = Array.from({ length: meta.lastPage }, (_, i) => i + 1)
    
    return (
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-t border-slate-800">
        <p className="text-sm text-slate-500">
          Affichage de <span className="font-medium text-slate-300">{((meta.currentPage - 1) * meta.perPage) + 1}</span> à{' '}
          <span className="font-medium text-slate-300">{Math.min(meta.currentPage * meta.perPage, meta.total)}</span> sur{' '}
          <span className="font-medium text-slate-300">{meta.total}</span> résultats
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => meta.currentPage > 1 && onPageChange(meta.currentPage - 1)}
            disabled={meta.currentPage === 1}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                meta.currentPage === p
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => meta.currentPage < meta.lastPage && onPageChange(meta.currentPage + 1)}
            disabled={meta.currentPage === meta.lastPage}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  // Rendu pour la pagination Inertia (Backend)
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 border-t border-slate-800">
      <div className="flex-1 flex justify-between sm:hidden">
        {/* Mobile simple buttons could go here */}
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Affichage de <span className="font-medium text-slate-300">{((meta.currentPage - 1) * meta.perPage) + 1}</span> à{' '}
            <span className="font-medium text-slate-300">{Math.min(meta.currentPage * meta.perPage, meta.total)}</span> sur{' '}
            <span className="font-medium text-slate-300">{meta.total}</span> résultats
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-xl shadow-sm space-x-1" aria-label="Pagination">
            {links?.map((link, idx) => {
              // Nettoyage des labels (Adonis peut renvoyer &laquo; ou &raquo;)
              let label = link.label
              if (label.includes('Previous')) return (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  className={`relative inline-flex items-center p-2 rounded-lg border border-slate-700 bg-slate-900 text-sm font-medium text-slate-400 hover:bg-slate-800 ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <ChevronLeft size={18} />
                </Link>
              )
              if (label.includes('Next')) return (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  className={`relative inline-flex items-center p-2 rounded-lg border border-slate-700 bg-slate-900 text-sm font-medium text-slate-400 hover:bg-slate-800 ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <ChevronRight size={18} />
                </Link>
              )

              return (
                <Link
                  key={idx}
                  href={link.url || '#'}
                  className={`relative inline-flex items-center px-4 py-2 rounded-lg border border-slate-700 text-sm font-bold transition-all ${
                    link.active
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 z-10'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                  } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`}
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
