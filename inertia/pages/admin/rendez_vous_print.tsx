import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

interface AppointmentPrint {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string   // YYYY-MM-DD
  time: string
  subject: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

interface Props {
  appointments: AppointmentPrint[]
  filterTitle: string
  printDate: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
}

export default function AdminAppointmentsPrint({ appointments, filterTitle, printDate }: Props) {
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
              <p className="text-slate-600 font-semibold text-sm mb-1">Administration de l'église — Rendez-vous pastoraux</p>
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
          <p className="text-slate-500 mt-2">Total : {appointments.length} rendez-vous</p>
        </div>

        {/* Tableau */}
        <table className="w-full text-left border-collapse text-xs border-2 border-slate-300">
          <thead>
            <tr className="bg-slate-100 print:bg-slate-100">
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">#</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Nom complet</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Contact</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Date & Heure</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Motif</th>
              <th className="border border-slate-300 px-3 py-2.5 font-bold text-slate-750">Statut</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((a, idx) => (
                <tr key={a.id} className="hover:bg-slate-50 print:break-inside-avoid">
                  <td className="border border-slate-300 px-3 py-2 text-slate-500">{idx + 1}</td>
                  <td className="border border-slate-300 px-3 py-2">
                    <div className="font-bold text-slate-800">{a.lastName} {a.firstName}</div>
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    <div className="text-slate-800 font-medium">{a.phone || '—'}</div>
                    <div className="text-slate-500 text-[10px]">{a.email || ''}</div>
                  </td>
                  <td className="border border-slate-300 px-3 py-2 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {new Date(a.date).toLocaleDateString('fr-FR', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className="text-slate-600 text-[10px] font-bold">{a.time}</div>
                  </td>
                  <td className="border border-slate-300 px-3 py-2 text-slate-700 italic">
                    &laquo;{a.subject}&raquo;
                  </td>
                  <td className="border border-slate-300 px-3 py-2">
                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold border rounded uppercase tracking-wide ${
                      a.status === 'confirmed'
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : a.status === 'pending'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-red-400 bg-red-50 text-red-700'
                    }`}>
                      {STATUS_LABELS[a.status] ?? a.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border border-slate-300 px-4 py-8 text-center text-slate-500 italic">
                  Aucun rendez-vous trouvé pour cette sélection.
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
