import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

interface Newcomer {
  id: number
  date: string
  lastname: string
  firstname: string
  gender: 'M' | 'F'
  phone: string | null
  email: string | null
  profession: string | null
  maritalStatus: string | null
  city: string | null
  address: string | null
  heardAbout: string
  comeBack: boolean
  baptized: boolean
  spiritualFollowup: boolean
  receiveJesus: boolean
  joinCell: boolean
  serve: boolean
  suggestions: string | null
}

interface Props {
  newcomers: Newcomer[]
  filterTitle: string
  printDate: string
}

const HEARD_ABOUT_OPTIONS = [
  { value: 'invitation', label: 'Invitation par un proche' },
  { value: 'evangelisation', label: 'Action d’évangélisation' },
  { value: 'reseaux_sociaux', label: 'Réseaux sociaux' },
  { value: 'famille_philadelphie', label: 'Famille Philadelphie' },
  { value: 'autre', label: 'Autre' }
]

export default function AdminNewcomersPrint({ newcomers, filterTitle, printDate }: Props) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getHeardAboutLabel = (value: string) => {
    return HEARD_ABOUT_OPTIONS.find(opt => opt.value === value)?.label || value
  }

  return (
    <>
      <Head title={`${filterTitle} - Impression`} />
      
      <div className="bg-white text-black min-h-screen p-8 max-w-[29.7cm] mx-auto print:p-8 print:max-w-none">
        
        {/* En-tête */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <img src="/log-phila-mdt.png" alt="Logo Phila MDT" className="h-16 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">Phila MAISON DE TÉMOIGNAGES</h1>
              <p className="text-slate-600 font-semibold text-sm mb-1">Administration de l'église — Nouveaux Venus</p>
              <p className="text-slate-500 text-xs">Avenue Zoao n°25, Q/Matonge, C/Kalamu, Kinshasa RDC</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-600">Date d'impression</div>
            <div className="font-bold text-slate-800">{printDate}</div>
          </div>
        </div>

        {/* Titre du document */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-slate-800 uppercase bg-slate-100 py-3 px-6 inline-block rounded-lg print:bg-transparent print:border print:border-slate-300">
            {filterTitle}
          </h2>
          <p className="text-slate-500 mt-2">Total : {newcomers.length} nouveau(x) venu(s)</p>
        </div>

        {/* Tableau de données */}
        <table className="w-full text-left border-collapse text-xs border-2 border-slate-300">
          <thead>
            <tr className="bg-slate-100 print:bg-slate-100">
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Date</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Nom complet</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Genre</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Contact (Tél/Email)</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Ville / Adresse</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Comment connu</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Décisions spirituelles</th>
            </tr>
          </thead>
          <tbody>
            {newcomers.length > 0 ? (
              newcomers.map((n) => {
                const decisions = []
                if (n.baptized) decisions.push('Baptisé(e)')
                if (n.spiritualFollowup) decisions.push('Suivi Sp.')
                if (n.receiveJesus) decisions.push('Reçu Jésus')
                if (n.joinCell) decisions.push('Intégré Cellule')
                if (n.serve) decisions.push('Veut Servir')
                if (n.comeBack) decisions.push('Revenir')

                return (
                  <tr key={n.id} className="hover:bg-slate-50 print:break-inside-avoid">
                    <td className="border border-slate-300 px-3 py-2 text-slate-700 whitespace-nowrap">
                      {new Date(n.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="border border-slate-300 px-3 py-2">
                      <div className="font-bold text-slate-800">{n.lastname} {n.firstname}</div>
                      {n.profession && <div className="text-[10px] text-slate-500 capitalize">{n.profession} · {n.maritalStatus}</div>}
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-700">
                      {n.gender === 'M' ? 'Homme' : 'Femme'}
                    </td>
                    <td className="border border-slate-300 px-3 py-2">
                      <div className="text-slate-800 font-medium">{n.phone || '—'}</div>
                      <div className="text-slate-500 text-[10px]">{n.email || ''}</div>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-700">
                      <div className="font-medium">{n.city || '—'}</div>
                      <div className="text-slate-500 text-[10px]">{n.address || ''}</div>
                    </td>
                    <td className="border border-slate-300 px-3 py-2 text-slate-700">
                      {getHeardAboutLabel(n.heardAbout)}
                    </td>
                    <td className="border border-slate-300 px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {decisions.length > 0 ? (
                          decisions.map(d => (
                            <span key={d} className="inline-block px-1.5 py-0.5 text-[9px] font-bold border border-slate-400 bg-slate-100 text-slate-700 rounded">
                              {d}
                            </span>
                          ))
                        ) : (
                          <span className="italic text-slate-450 text-[10px]">Aucune</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="border border-slate-300 px-4 py-8 text-center text-slate-500 italic">
                  Aucun nouveau venu trouvé pour cette sélection.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pied de page */}
        <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <span>Document généré automatiquement par le système de gestion Phila MDT</span>
          <span>Phila MDT — Confidentiel</span>
        </div>

      </div>

      <style>{`
        @media print {
          /* Supprime l'en-tête (titre) et le pied de page (URL) par défaut du navigateur */
          @page {
            size: A4 landscape;
            margin: 0; 
          }
          
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
