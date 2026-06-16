import { Head } from '@inertiajs/react'
import { useState, useMemo } from 'react'
import AdminLayout from '../../layouts/admin'
import Pagination from '../../components/Pagination'
import { 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  X, 
  Check, 
  Printer, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Scale, 
  Calendar,
  AlertCircle,
  Tag
} from 'lucide-react'

interface Operation {
  id: number
  date: string
  montant: number
  devise: 'USD' | 'CDF' | 'EUR'
  type: 'entrée' | 'sortie'
  categorie: string
  description: string
  moyen_paiement: string
}

type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'all'

const CATEGORIES_ENTREE = [
  'Donation',
  'Dîme',
  'Action de grâce',
  'Offrande',
  'Partenariat',
  'Autre entrée'
]

const CATEGORIES_SORTIE = [
  'Loyer',
  'Électricité',
  'Achat matériel',
  'Transports',
  'Salaires / Soutiens',
  'Événementiel',
  'Social / Entraide',
  'Autre dépense'
]

const DEVISES = ['USD', 'CDF', 'EUR'] as const

const MOYENS_PAIEMENT = [
  'espèce',
  'chèque',
  'virement bancaire',
  'mobile money',
  'terminal',
  'FlexPay'
] as const

// Mock data spanning different times around June 16, 2026
const initialOperations: Operation[] = [
  { id: 1, date: '2026-06-16', montant: 500, devise: 'USD', type: 'entrée', categorie: 'Donation', description: 'Donation anonyme pour travaux de rénovation', moyen_paiement: 'espèce' },
  { id: 2, date: '2026-06-16', montant: 150000, devise: 'CDF', type: 'sortie', categorie: 'Transports', description: 'Frais de transport pour la chorale', moyen_paiement: 'virement bancaire' },
  { id: 3, date: '2026-06-15', montant: 1200, devise: 'USD', type: 'entrée', categorie: 'Dîme', description: 'Dîme mensuelle membre fidèle', moyen_paiement: 'virement bancaire' },
  { id: 4, date: '2026-06-14', montant: 450, devise: 'EUR', type: 'sortie', categorie: 'Achat matériel', description: 'Achat de nouveaux microphones sans fil', moyen_paiement: 'terminal' },
  { id: 5, date: '2026-06-12', montant: 350000, devise: 'CDF', type: 'entrée', categorie: 'Action de grâce', description: 'Action de grâce culte du dimanche', moyen_paiement: 'espèce' },
  { id: 6, date: '2026-06-10', montant: 800, devise: 'USD', type: 'sortie', categorie: 'Loyer', description: 'Paiement loyer mensuel bureau', moyen_paiement: 'virement bancaire' },
  { id: 7, date: '2026-06-05', montant: 250, devise: 'USD', type: 'entrée', categorie: 'Offrande', description: 'Offrandes récoltées lors de la veillée', moyen_paiement: 'FlexPay' },
  { id: 8, date: '2026-05-28', montant: 1500, devise: 'USD', type: 'entrée', categorie: 'Partenariat', description: 'Partenariat trimestriel projet social', moyen_paiement: 'virement bancaire' },
  { id: 9, date: '2026-05-15', montant: 600, devise: 'USD', type: 'sortie', categorie: 'Salaires / Soutiens', description: 'Indemnités mensuelles secrétariat', moyen_paiement: 'mobile money' },
  { id: 10, date: '2026-01-10', montant: 2000, devise: 'USD', type: 'entrée', categorie: 'Donation', description: 'Donation annuelle de début d\'année', moyen_paiement: 'chèque' }
]

// exchange rates config

const emptyForm: Omit<Operation, 'id'> = {
  date: '2026-06-16',
  montant: 0,
  devise: 'USD',
  type: 'entrée',
  categorie: 'Donation',
  description: '',
  moyen_paiement: 'espèce'
}

export default function AdminFinances() {
  const [operations, setOperations] = useState<Operation[]>(initialOperations)
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<PeriodFilter>('month')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'tous' | 'entrée' | 'sortie'>('tous')
  const [selectedMoyenFilter, setSelectedMoyenFilter] = useState<string>('tous')
  const [modal, setModal] = useState<'encaisser' | 'decaisser' | 'edit' | 'delete' | 'categories' | null>(null)
  const [selectedOp, setSelectedOp] = useState<Operation | null>(null)
  const [form, setForm] = useState<Omit<Operation, 'id'>>(emptyForm)
  
  // Dynamic categories states
  const [categoriesEntree, setCategoriesEntree] = useState<string[]>(CATEGORIES_ENTREE)
  const [categoriesSortie, setCategoriesSortie] = useState<string[]>(CATEGORIES_SORTIE)
  
  // Dynamic exchange rates
  const [exchangeRates, setExchangeRates] = useState({
    CDF: 2800,
    EUR: 1.08
  })
  
  // State for new category additions
  const [newCatName, setNewCatName] = useState('')
  const [newCatType, setNewCatType] = useState<'entrée' | 'sortie'>('entrée')
  
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 8

  // Helper date function
  const parseDate = (dateStr: string) => new Date(dateStr)

  // Filter operations based on period and search and type
  const filteredOperations = useMemo(() => {
    const today = new Date('2026-06-16')
    
    return operations.filter(op => {
      // 1. Period filter
      const opDate = parseDate(op.date)
      let matchPeriod = true

      if (period === 'today') {
        matchPeriod = op.date === '2026-06-16'
      } else if (period === 'week') {
        const diffTime = today.getTime() - opDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        matchPeriod = diffDays >= 0 && diffDays <= 7
      } else if (period === 'month') {
        matchPeriod = opDate.getFullYear() === 2026 && opDate.getMonth() === 5 // June (5 in JS)
      } else if (period === 'year') {
        matchPeriod = opDate.getFullYear() === 2026
      }

      // 2. Search filter
      const matchSearch = op.description.toLowerCase().includes(search.toLowerCase()) || 
                          op.categorie.toLowerCase().includes(search.toLowerCase()) ||
                          op.montant.toString().includes(search)

      // 3. Type filter
      const matchType = selectedTypeFilter === 'tous' || op.type === selectedTypeFilter

      // 4. Moyen de paiement filter
      const matchMoyen = selectedMoyenFilter === 'tous' || op.moyen_paiement === selectedMoyenFilter

      return matchPeriod && matchSearch && matchType && matchMoyen
    })
  }, [operations, period, search, selectedTypeFilter, selectedMoyenFilter])

  // Aggregate stats based on filtered operations
  const stats = useMemo(() => {
    let entreesUSD = 0, entreesCDF = 0, entreesEUR = 0
    let sortiesUSD = 0, sortiesCDF = 0, sortiesEUR = 0

    filteredOperations.forEach(op => {
      if (op.type === 'entrée') {
        if (op.devise === 'USD') entreesUSD += op.montant
        else if (op.devise === 'CDF') entreesCDF += op.montant
        else if (op.devise === 'EUR') entreesEUR += op.montant
      } else {
        if (op.devise === 'USD') sortiesUSD += op.montant
        else if (op.devise === 'CDF') sortiesCDF += op.montant
        else if (op.devise === 'EUR') sortiesEUR += op.montant
      }
    })

    // Unified total values converted to USD for graphical representation
    const totalEntreesEquivalent = entreesUSD + 
                                   (exchangeRates.CDF > 0 ? (entreesCDF / exchangeRates.CDF) : 0) + 
                                   (entreesEUR * exchangeRates.EUR)

    const totalSortiesEquivalent = sortiesUSD + 
                                   (exchangeRates.CDF > 0 ? (sortiesCDF / exchangeRates.CDF) : 0) + 
                                   (sortiesEUR * exchangeRates.EUR)

    const soldeEquivalent = totalEntreesEquivalent - totalSortiesEquivalent

    return {
      entrees: {
        equivalent: totalEntreesEquivalent,
        USD: entreesUSD,
        CDF: entreesCDF,
        EUR: entreesEUR
      },
      sorties: {
        equivalent: totalSortiesEquivalent,
        USD: sortiesUSD,
        CDF: sortiesCDF,
        EUR: sortiesEUR
      },
      solde: {
        equivalent: soldeEquivalent,
        USD: entreesUSD - sortiesUSD,
        CDF: entreesCDF - sortiesCDF,
        EUR: entreesEUR - sortiesEUR
      }
    }
  }, [filteredOperations, exchangeRates])

  // Pagination calculations
  const total = filteredOperations.length
  const lastPage = Math.ceil(total / perPage)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * perPage
    return filteredOperations.slice(start, start + perPage)
  }, [filteredOperations, currentPage])

  const paginationMeta = {
    total,
    perPage,
    currentPage,
    lastPage,
    firstPage: 1
  }

  // Modals operations
  const openEncaisser = () => {
    setForm({
      ...emptyForm,
      type: 'entrée',
      categorie: categoriesEntree[0] || ''
    })
    setModal('encaisser')
  }

  const openDecaisser = () => {
    setForm({
      ...emptyForm,
      type: 'sortie',
      categorie: categoriesSortie[0] || ''
    })
    setModal('decaisser')
  }

  const openEdit = (op: Operation) => {
    setSelectedOp(op)
    setForm({
      date: op.date,
      montant: op.montant,
      devise: op.devise,
      type: op.type,
      categorie: op.categorie,
      description: op.description,
      moyen_paiement: op.moyen_paiement
    })
    setModal('edit')
  }

  const openDelete = (op: Operation) => {
    setSelectedOp(op)
    setModal('delete')
  }

  const closeModal = () => {
    setModal(null)
    setSelectedOp(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.montant <= 0) {
      alert('Veuillez entrer un montant valide supérieur à 0')
      return
    }

    if (modal === 'encaisser' || modal === 'decaisser') {
      const newOp: Operation = {
        id: Date.now(),
        ...form
      }
      setOperations([newOp, ...operations])
    } else if (modal === 'edit' && selectedOp) {
      setOperations(
        operations.map(op => (op.id === selectedOp.id ? { ...op, ...form } : op))
      )
    }
    closeModal()
    setCurrentPage(1)
  }

  const handleDelete = () => {
    if (selectedOp) {
      setOperations(operations.filter(op => op.id !== selectedOp.id))
    }
    closeModal()
    setCurrentPage(1)
  }

  const handlePrint = () => {
    window.print()
  }

  // Helper formatting currencies
  const formatCurrency = (val: number, devise: 'USD' | 'CDF' | 'EUR') => {
    if (devise === 'USD') return `$${val.toLocaleString('fr-FR')}`
    if (devise === 'EUR') return `${val.toLocaleString('fr-FR')} €`
    return `${val.toLocaleString('fr-FR')} CDF`
  }

  return (
    <>
      <Head title="Finances — Admin Phila MDT" />
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        /* Hide spin buttons in chrome/safari/opera/edge */
        .rate-input::-webkit-outer-spin-button,
        .rate-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Hide spin buttons in firefox */
        .rate-input {
          -moz-appearance: textfield;
        }
      `}</style>

      <AdminLayout title="Gestion des Finances">
        {/* ── Entête & Filtres temporels ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 no-print">
          <div>
            <h2 className="text-white text-lg font-bold">Tableau de bord financier</h2>
            <p className="text-slate-400 text-xs mt-0.5">Pilotez les entrées, sorties et budgets de l'église</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
              {(['today', 'week', 'month', 'year', 'all'] as const).map(p => {
                const labels: Record<PeriodFilter, string> = {
                  today: "Aujourd'hui",
                  week: "Semaine",
                  month: "Mois",
                  year: "Année",
                  all: "Tout"
                }
                return (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setCurrentPage(1) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      period === p
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {labels[p]}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Coins size={12} className="text-slate-400" />
                Taux de change
              </span>
              <div className="h-4 w-px bg-slate-800" />
              
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] font-medium">1 $ =</span>
                <input 
                  type="number" 
                  min="1"
                  step="any"
                  value={exchangeRates.CDF} 
                  onChange={e => setExchangeRates({ ...exchangeRates, CDF: parseFloat(e.target.value) || 0 })}
                  className="rate-input w-20 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-center text-white font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-xs"
                />
                <span className="text-slate-400 text-[10px] font-medium">FC</span>
              </div>
              
              <div className="h-4 w-px bg-slate-800" />
              
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[10px] font-medium">1 € =</span>
                <input 
                  type="number" 
                  min="0.01"
                  step="any"
                  value={exchangeRates.EUR} 
                  onChange={e => setExchangeRates({ ...exchangeRates, EUR: parseFloat(e.target.value) || 0 })}
                  className="rate-input w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-center text-white font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-xs"
                />
                <span className="text-slate-400 text-[10px] font-medium">$</span>
              </div>
            </div>

            <button 
              onClick={handlePrint} 
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs font-semibold transition-colors border border-slate-800"
            >
              <Printer size={14} />
              Imprimer
            </button>
          </div>
        </div>

        {/* ── Cartes statistiques dynamiques ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print-section">
          {/* Card: Entrées */}
          <div className="bg-slate-900 border border-emerald-500/10 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group shadow-lg shadow-black/20">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Total Entrées</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-400">
                <TrendingUp size={16} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {formatCurrency(Math.round(stats.entrees.equivalent), 'USD')}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Équivalent total converti</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>USD: <strong className="text-white">${stats.entrees.USD.toLocaleString()}</strong></span>
              <span>CDF: <strong className="text-white">{stats.entrees.CDF.toLocaleString()} FC</strong></span>
              <span>EUR: <strong className="text-white">{stats.entrees.EUR.toLocaleString()} €</strong></span>
            </div>
          </div>

          {/* Card: Sorties */}
          <div className="bg-slate-900 border border-rose-500/10 rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group shadow-lg shadow-black/20">
            <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-400 font-semibold uppercase tracking-wider">Total Sorties</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-rose-500/10 text-rose-400">
                <TrendingDown size={16} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-white">
                {formatCurrency(Math.round(stats.sorties.equivalent), 'USD')}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Équivalent total converti</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>USD: <strong className="text-white">${stats.sorties.USD.toLocaleString()}</strong></span>
              <span>CDF: <strong className="text-white">{stats.sorties.CDF.toLocaleString()} FC</strong></span>
              <span>EUR: <strong className="text-white">{stats.sorties.EUR.toLocaleString()} €</strong></span>
            </div>
          </div>

          {/* Card: Solde */}
          <div className={`bg-slate-900 border rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden group shadow-lg shadow-black/20 ${
            stats.solde.equivalent >= 0 ? 'border-blue-500/10' : 'border-red-500/20 bg-red-950/5'
          }`}>
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-300" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Solde Net</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                stats.solde.equivalent >= 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
              }`}>
                <Scale size={16} />
              </div>
            </div>
            <div>
              <p className={`text-3xl font-black ${stats.solde.equivalent >= 0 ? 'text-white' : 'text-rose-400'}`}>
                {formatCurrency(Math.round(stats.solde.equivalent), 'USD')}
              </p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">Solde équivalent converti</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>USD: <strong className={stats.solde.USD >= 0 ? "text-white" : "text-rose-400"}>${stats.solde.USD.toLocaleString()}</strong></span>
              <span>CDF: <strong className={stats.solde.CDF >= 0 ? "text-white" : "text-rose-400"}>{stats.solde.CDF.toLocaleString()} FC</strong></span>
              <span>EUR: <strong className={stats.solde.EUR >= 0 ? "text-white" : "text-rose-400"}>{stats.solde.EUR.toLocaleString()} €</strong></span>
            </div>
          </div>
        </div>

        {/* ── Actions & Recherche ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 no-print">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-sm min-w-[200px]">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                placeholder="Rechercher par description, catégorie..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1">
              <Filter size={12} className="text-slate-500 ml-2" />
              {(['tous', 'entrée', 'sortie'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => { setSelectedTypeFilter(type); setCurrentPage(1) }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedTypeFilter === type
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {type === 'tous' ? 'Tous' : type === 'entrée' ? 'Entrées' : 'Sorties'}
                </button>
              ))}
            </div>

            <select
              value={selectedMoyenFilter}
              onChange={e => { setSelectedMoyenFilter(e.target.value); setCurrentPage(1) }}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-primary transition-colors cursor-pointer capitalize"
            >
              <option value="tous">Tous les moyens de paiement</option>
              {MOYENS_PAIEMENT.map(mp => (
                <option key={mp} value={mp}>
                  {mp}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
            <button 
              onClick={() => { setModal('categories'); setNewCatName(''); setNewCatType('entrée') }}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <Tag size={14} className="text-slate-400" />
              Natures d'opérations
            </button>
            <button 
              onClick={openDecaisser} 
              className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <Minus size={14} />
              Décaisser (Sortie)
            </button>
            <button 
              onClick={openEncaisser} 
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
            >
              <Plus size={14} />
              Encaisser (Entrée)
            </button>
          </div>
        </div>

        {/* ── Tableau des opérations ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden print-section shadow-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-white text-sm font-bold flex items-center gap-2">
              <Coins size={16} className="text-primary" />
              Journal des Opérations
              <span className="text-slate-500 font-normal text-xs">({total} opération{total > 1 ? 's' : ''})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Désignation / Description</th>
                  <th className="text-left px-6 py-4">Type / Flux</th>
                  <th className="text-left px-6 py-4">Catégorie</th>
                  <th className="text-left px-6 py-4">Moyen de paiement</th>
                  <th className="text-right px-6 py-4">Montant</th>
                  <th className="text-center px-6 py-4 no-print">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={24} className="text-slate-600" />
                        <span>Aucune opération trouvée pour les filtres sélectionnés.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map(op => (
                    <tr key={op.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap font-medium">
                        {new Date(op.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white font-medium block truncate max-w-[280px]" title={op.description}>
                          {op.description || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          op.type === 'entrée' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {op.type === 'entrée' ? (
                            <>
                              <TrendingUp size={10} />
                              Entrée
                            </>
                          ) : (
                            <>
                              <TrendingDown size={10} />
                              Sortie
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 font-medium whitespace-nowrap">
                        {op.categorie}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/30 text-[10px] font-medium capitalize">
                          {op.moyen_paiement}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-black text-sm whitespace-nowrap ${
                        op.type === 'entrée' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {op.type === 'entrée' ? '+' : '-'} {formatCurrency(op.montant, op.devise)}
                      </td>
                      <td className="px-6 py-4 text-center no-print">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => openEdit(op)} 
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
                            title="Modifier"
                          >
                            <Pencil size={12} />
                          </button>
                          <button 
                            onClick={() => openDelete(op)} 
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination meta={paginationMeta} onPageChange={setCurrentPage} />
        </div>

        {/* ── Modal: Formulaire Encaisser / Décaisser / Modifier ── */}
        {(modal === 'encaisser' || modal === 'decaisser' || modal === 'edit') && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-white font-bold flex items-center gap-2">
                  {modal === 'encaisser' && (
                    <>
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Plus size={14} />
                      </div>
                      <span>Encaisser un flux d'entrée</span>
                    </>
                  )}
                  {modal === 'decaisser' && (
                    <>
                      <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <Minus size={14} />
                      </div>
                      <span>Décaisser un flux de sortie</span>
                    </>
                  )}
                  {modal === 'edit' && (
                    <>
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Pencil size={14} />
                      </div>
                      <span>Modifier l'opération</span>
                    </>
                  )}
                </h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="p-6 space-y-4">
                  {/* Grid Date & Montant */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1.5">
                        <Calendar size={10} /> Date d'opération
                      </label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 block">
                        Montant
                      </label>
                      <input
                        type="number"
                        min="0.01"
                        step="any"
                        required
                        placeholder="Ex: 500"
                        value={form.montant || ''}
                        onChange={e => setForm({ ...form, montant: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-primary font-bold"
                      />
                    </div>
                  </div>

                  {/* Grid Devise, Moyen de Paiement & Catégorie */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 block">
                        Devise
                      </label>
                      <select
                        value={form.devise}
                        onChange={e => setForm({ ...form, devise: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-[11px] text-white focus:outline-none focus:border-primary font-semibold"
                      >
                        {DEVISES.map(dev => (
                          <option key={dev} value={dev}>{dev}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 block">
                        Moyen de paiement
                      </label>
                      <select
                        value={form.moyen_paiement}
                        onChange={e => setForm({ ...form, moyen_paiement: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-[11px] text-white focus:outline-none focus:border-primary font-semibold"
                      >
                        {MOYENS_PAIEMENT.map(mp => (
                          <option key={mp} value={mp}>{mp}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 block">
                        Catégorie
                      </label>
                      <select
                        value={form.categorie}
                        onChange={e => setForm({ ...form, categorie: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-[11px] text-white focus:outline-none focus:border-primary font-medium"
                      >
                        {form.type === 'entrée' 
                          ? categoriesEntree.map(cat => <option key={cat} value={cat}>{cat}</option>)
                          : categoriesSortie.map(cat => <option key={cat} value={cat}>{cat}</option>)
                        }
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 block">
                      Description / Motif
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Indiquez le motif précis de l'opération..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/30">
                  <button 
                    type="button"
                    onClick={closeModal} 
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white border border-slate-750 hover:bg-slate-800 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-md shadow-primary/10"
                  >
                    <Check size={14} />
                    {modal === 'edit' ? 'Enregistrer les modifications' : 'Confirmer l\'opération'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Confirmation de suppression ── */}
        {modal === 'delete' && selectedOp && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
                <Trash2 size={20} />
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-base">Supprimer l'opération</h3>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer définitivement cette opération de{' '}
                  <strong className="text-white">
                    {formatCurrency(selectedOp.montant, selectedOp.devise)}
                  </strong>{' '}
                  ({selectedOp.categorie}) ? Cette action est irréversible.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={closeModal} 
                  className="flex-1 py-2.5 rounded-xl border border-slate-750 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDelete} 
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal: Gestion des Natures d'Opérations ── */}
        {modal === 'categories' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 no-print animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Tag size={14} />
                  </div>
                  <span>Natures d'opérations (Catégories)</span>
                </h3>
                <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Columns: Entry / Exit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Entrées */}
                  <div className="space-y-3">
                    <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-850">
                      <TrendingUp size={14} /> Natures d'Entrées
                    </h4>
                    <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                      {categoriesEntree.length === 0 ? (
                        <p className="text-slate-500 text-xs italic py-2">Aucune nature configurée</p>
                      ) : (
                        categoriesEntree.map(cat => (
                          <div key={cat} className="flex items-center justify-between bg-slate-950 border border-slate-850/50 rounded-xl px-3 py-2">
                            <span className="text-slate-200 text-xs font-medium">{cat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setCategoriesEntree(categoriesEntree.filter(c => c !== cat))
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                              title="Supprimer la nature"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Sorties */}
                  <div className="space-y-3">
                    <h4 className="text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-850">
                      <TrendingDown size={14} /> Natures de Sorties
                    </h4>
                    <div className="max-h-56 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                      {categoriesSortie.length === 0 ? (
                        <p className="text-slate-500 text-xs italic py-2">Aucune nature configurée</p>
                      ) : (
                        categoriesSortie.map(cat => (
                          <div key={cat} className="flex items-center justify-between bg-slate-950 border border-slate-850/50 rounded-xl px-3 py-2">
                            <span className="text-slate-200 text-xs font-medium">{cat}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setCategoriesSortie(categoriesSortie.filter(c => c !== cat))
                              }}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                              title="Supprimer la nature"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Ajouter une nature */}
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3">
                  <h5 className="text-white font-bold text-xs">Créer une nouvelle nature</h5>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Ex: Sponsoring, Événements, Bureau..."
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={newCatType}
                        onChange={e => setNewCatType(e.target.value as any)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-primary cursor-pointer font-bold"
                      >
                        <option value="entrée">Entrée (Revenu)</option>
                        <option value="sortie">Sortie (Dépense)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => {
                          const nameTrimmed = newCatName.trim()
                          if (!nameTrimmed) return
                          if (newCatType === 'entrée') {
                            if (categoriesEntree.includes(nameTrimmed)) {
                              alert('Cette nature d\'entrée existe déjà')
                              return
                            }
                            setCategoriesEntree([...categoriesEntree, nameTrimmed])
                          } else {
                            if (categoriesSortie.includes(nameTrimmed)) {
                              alert('Cette nature de sortie existe déjà')
                              return
                            }
                            setCategoriesSortie([...categoriesSortie, nameTrimmed])
                          }
                          setNewCatName('')
                        }}
                        className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-md shadow-primary/10"
                      >
                        <Plus size={12} />
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/30">
                <button 
                  type="button"
                  onClick={closeModal} 
                  className="px-5 py-2.5 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors border border-slate-750"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
