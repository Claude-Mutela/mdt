import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

interface Ministry {
  id: number
  name: string
}

interface Member {
  id: number
  firstname: string
  lastname: string
  email: string | null
  phone: string | null
  gender: 'M' | 'F' | null
  dateIntegration: string | null
  statut: 'actif' | 'inactif'
  typeMember: 'responsable' | 'membre' | 'visiteur' | null
  ministry: Ministry | null
  createdAt: string
}

interface Props {
  members: Member[]
  filterTitle: string
  printDate: string
}

export default function AdminMembresPrint({ members, filterTitle, printDate }: Props) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

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
              <p className="text-slate-600 font-semibold text-sm mb-1">Administration de l'église</p>
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
          <p className="text-slate-500 mt-2">Total : {members.length} membre(s)</p>
        </div>

        {/* Tableau de données */}
        <table className="w-full text-left border-collapse text-sm border-2 border-slate-300">
          <thead>
            <tr className="bg-slate-100 print:bg-slate-100">
              <th className="border border-slate-300 px-4 py-3 font-bold text-slate-700">Nom complet</th>
              <th className="border border-slate-300 px-4 py-3 font-bold text-slate-700">Contact</th>
              <th className="border border-slate-300 px-4 py-3 font-bold text-slate-700">Ministère</th>
              <th className="border border-slate-300 px-4 py-3 font-bold text-slate-700">Genre</th>
              <th className="border border-slate-300 px-4 py-3 font-bold text-slate-700">Statut</th>
              <th className="border border-slate-300 px-4 py-3 font-bold text-slate-700">Type de membre</th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 ? (
              members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 print:break-inside-avoid">
                  <td className="border border-slate-300 px-4 py-2">
                    <div className="font-semibold text-slate-800">{m.firstname} {m.lastname}</div>
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <div className="text-slate-600">{m.phone || '-'}</div>
                    <div className="text-slate-500 text-xs">{m.email || ''}</div>
                  </td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">
                    {m.ministry ? m.ministry.name : <span className="italic text-slate-400">Aucun</span>}
                  </td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">
                    {m.gender === 'M' ? 'Homme' : m.gender === 'F' ? 'Femme' : '-'}
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <span className={`font-semibold text-xs uppercase ${m.statut === 'actif' ? 'text-green-600' : 'text-red-600'}`}>
                      {m.statut}
                    </span>
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">
                      {m.typeMember || '-'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-slate-300 px-4 py-8 text-center text-slate-500 italic">
                  Aucun membre trouvé pour cette sélection.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pied de page */}
        <div className="mt-12 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <span>Document généré par Phila MDT</span>
        </div>

      </div>

      <style>{`
        @media print {
          /* En mettant margin à 0, le navigateur n'affiche pas l'URL ni le titre de la page (headers/footers par défaut) */
          @page {
            size: A4 landscape;
            margin: 0; 
          }
          
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </>
  )
}
