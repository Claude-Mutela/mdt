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

                      {/* Lien WhatsApp ou contact de secours */}
                      {(() => {
                        const raw = cellule.telephone?.replace(/[\s\-().]/g, '').replace(/^\+/, '')
                        const href = raw ? `https://wa.me/${raw}` : '/contact'
                        const isWhatsApp = !!raw
                        return (
                          <a
                            href={href}
                            target={isWhatsApp ? '_blank' : undefined}
                            rel={isWhatsApp ? 'noopener noreferrer' : undefined}
                            className="px-6 md:px-8 py-4 md:py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between group-hover:bg-[#25D366] group-hover:border-[#25D366] transition-colors duration-300"
                          >
                            <span className="text-sm font-bold text-slate-500 group-hover:text-white transition-colors">
                              Rejoindre cette cellule
                            </span>
                            <svg
                              className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </a>
                        )
                      })()}
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
