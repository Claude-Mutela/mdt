import { Head, Link } from '@inertiajs/react'
import { MapPin, Clock, Phone, Users, ArrowRight, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface CelluleItem {
  id: number
  nom: string
  description: string
  horaire: string
  adresse: string
  telephone: string
  responsable: string | null
}

interface Props {
  cellules: CelluleItem[]
}

const TAG_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-amber-500',
]

const PER_PAGE = 9

/** Pagination légère pour le site public (thème clair, responsive) */
function PublicPagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
}: {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (p: number) => void
}) {
  if (lastPage <= 1) return null

  const from = (currentPage - 1) * perPage + 1
  const to = Math.min(currentPage * perPage, total)

  // Calcul des numéros de page à afficher (avec ellipsis)
  const getPageNumbers = (): (number | '...')[] => {
    if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1)

    const pages: (number | '...')[] = [1]
    if (currentPage > 3) pages.push('...')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(lastPage - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < lastPage - 2) pages.push('...')
    pages.push(lastPage)
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:gap-0">
      {/* Compteur */}
      <p className="text-sm text-slate-500 order-2 sm:order-1">
        Affichage de{' '}
        <span className="font-semibold text-slate-700">{from}</span>
        {' '}à{' '}
        <span className="font-semibold text-slate-700">{to}</span>
        {' '}sur{' '}
        <span className="font-semibold text-slate-700">{total}</span>
        {' '}cellule{total > 1 ? 's' : ''}
      </p>

      {/* Boutons de navigation */}
      <nav className="flex items-center gap-1 order-1 sm:order-2" aria-label="Pagination des cellules">
        {/* Précédent */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Page précédente"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Pages numérotées — cachées sur mobile, visibles sm+ */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) =>
            page === '...' ? (
              <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`w-9 h-9 rounded-xl border text-sm font-bold transition-all shadow-sm ${
                  currentPage === page
                    ? 'bg-primary border-primary text-white shadow-primary/25 shadow-md'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-primary hover:text-white hover:border-primary'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Indicateur compact — visible uniquement sur mobile */}
        <span className="sm:hidden flex items-center justify-center px-4 h-9 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700">
          {currentPage} / {lastPage}
        </span>

        {/* Suivant */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-label="Page suivante"
          className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  )
}

export default function Cellules({ cellules = [] }: Props) {
  const [currentPage, setCurrentPage] = useState(1)

  const lastPage = Math.ceil(cellules.length / PER_PAGE) || 1
  const paginated = cellules.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll doux vers le début de la grille
    document.getElementById('cellules-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Head title="Nos Cellules de Maison — Phila MDT" />
      <main className="bg-background-off min-h-screen">
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-[#1C1613]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-[#1C1613] to-black/90" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent-orange text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <Users size={14} />
              Communion Fraternelle
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif mb-6 leading-[1.1]">
              Nos <span className="text-accent-orange italic">Cellules</span> de Maison
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Rejoignez une famille spirituelle près de chez vous. Priez, partagez la Parole de Dieu et grandissez ensemble dans la foi.
            </p>
            {cellules.length > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {cellules.length} cellule{cellules.length > 1 ? 's' : ''} active{cellules.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </section>

        {/* ── Grid Section ── */}
        <section id="cellules-grid" className="py-16 relative -mt-10 z-20 scroll-mt-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {cellules.length === 0 ? (
              <div className="text-center py-24 text-slate-500 bg-white rounded-3xl shadow-lg border border-slate-100">
                <Users size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-xl font-semibold">Aucune cellule disponible pour le moment.</p>
                <p className="text-sm mt-2">Revenez bientôt ou contactez-nous pour plus d'informations.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {paginated.map((cellule, index) => (
                    <div
                      key={cellule.id}
                      className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                    >
                      <div className="p-6 md:p-8 flex-grow space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl md:text-2xl font-black font-serif text-slate-900 group-hover:text-primary transition-colors leading-tight">
                            {cellule.nom}
                          </h3>
                          <span
                            className={`w-3 h-3 rounded-full shrink-0 mt-2 ${TAG_COLORS[((currentPage - 1) * PER_PAGE + index) % TAG_COLORS.length]}`}
                          />
                        </div>

                        {cellule.description && (
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                            {cellule.description}
                          </p>
                        )}

                        <div className="space-y-3 pt-4 border-t border-slate-50">
                          {cellule.horaire && (
                            <div className="flex gap-3">
                              <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Horaire</p>
                                <p className="text-slate-900 font-medium text-sm">{cellule.horaire}</p>
                              </div>
                            </div>
                          )}

                          {cellule.adresse && (
                            <div className="flex gap-3">
                              <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Adresse</p>
                                <p className="text-slate-900 font-medium text-sm">{cellule.adresse}</p>
                              </div>
                            </div>
                          )}

                          {cellule.telephone && (
                            <div className="flex gap-3">
                              <Phone size={16} className="text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contact</p>
                                <p className="text-slate-900 font-medium text-sm">{cellule.telephone}</p>
                              </div>
                            </div>
                          )}

                          {cellule.responsable && (
                            <div className="flex gap-3">
                              <User size={16} className="text-primary shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Responsable</p>
                                <p className="text-slate-900 font-medium text-sm">{cellule.responsable}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link
                        href="/contact"
                        className="px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-primary group-hover:border-primary transition-colors duration-300"
                      >
                        <span className="text-sm font-bold text-slate-500 group-hover:text-white/90 transition-colors">
                          Rejoindre cette cellule
                        </span>
                        <ArrowRight size={16} className="text-slate-400 group-hover:text-white transition-colors" />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* ── Pagination ── */}
                <PublicPagination
                  currentPage={currentPage}
                  lastPage={lastPage}
                  total={cellules.length}
                  perPage={PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </>
            )}

            {/* ── Contact CTA ── */}
            <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-slate-100 max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-black font-serif text-slate-900 mb-4">
                Vous ne trouvez pas de cellule dans votre quartier ?
              </h3>
              <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                Contactez notre secrétariat pour être orienté vers la cellule la plus proche, ou découvrez comment ouvrir une nouvelle cellule chez vous.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-xl transition-colors shadow-md"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
