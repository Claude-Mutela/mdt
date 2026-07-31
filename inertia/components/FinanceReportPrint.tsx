/**
 * FinanceReportPrint.tsx
 * Composant dédié à l'impression du rapport financier.
 * Déclenché via window.print() depuis finances.tsx.
 * Format A4 paysage. Utilise visibility (et non display:none) pour
 * être compatible avec l'arbre React imbriqué dans le root div.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

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

interface PrintStats {
  entrees: { USD: number; CDF: number; EUR: number; equivalent: number }
  sorties: { USD: number; CDF: number; EUR: number; equivalent: number }
  solde:   { USD: number; CDF: number; EUR: number; equivalent: number }
}

interface FinanceReportPrintProps {
  operations: Operation[]
  stats: PrintStats
  periodLabel: string
  rates: { CDF: number; EUR: number }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MOIS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${String(d).padStart(2, '0')} ${MOIS_FR[m - 1]} ${y}`
}

function fmtAmt(val: number, devise: 'USD' | 'CDF' | 'EUR'): string {
  const abs = Math.abs(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (devise === 'USD') return `$ ${abs}`
  if (devise === 'EUR') return `€ ${abs}`
  return `${abs} FC`
}

// ─── Composant ───────────────────────────────────────────────────────────────

export default function FinanceReportPrint({ operations, stats, periodLabel, rates }: FinanceReportPrintProps) {
  const now = new Date()
  const genAt = `${String(now.getDate()).padStart(2, '0')} ${MOIS_FR[now.getMonth()]} ${now.getFullYear()} à ${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`

  return (
    <>
      {/*
        IMPORTANT — Stratégie CSS print :
        On utilise `visibility: hidden` sur body et `visibility: visible` sur
        #finance-print-root plutôt que `display: none` sur `body > *`.
        La raison : le composant est imbriqué dans le div#app de React.
        `display:none` sur le parent masquerait aussi cet enfant même avec
        `display:block`. Avec `visibility`, l'enfant peut se rendre visible
        indépendamment de son parent.
      */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0 !important; /* Enlève l'en-tête (AdonisJS) et le pied de page (localhost URL) du navigateur */
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Masquer tout le contenu via visibility (pas display) */
          body * {
            visibility: hidden !important;
          }

          /* Rendre visible le rapport et TOUS ses descendants */
          #finance-print-root,
          #finance-print-root * {
            visibility: visible !important;
          }

          /* Positionner le rapport pour occuper la page avec des marges internes (padding) */
          #finance-print-root {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
            padding: 12mm 14mm !important;
            background: #fff !important;
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 9pt;
            color: #1a1a2e;
          }
        }

        /* Masqué à l'écran, visible uniquement à l'impression */
        #finance-print-root {
          display: none;
        }

        @media print {
          #finance-print-root {
            display: block !important;
          }

          /* ─ En-tête ─ */
          .rpt-header {
            display: flex !important;
            align-items: center;
            justify-content: space-between;
            border-bottom: 2.5pt solid #e35c0a;
            padding-bottom: 6pt;
            margin-bottom: 10pt;
          }
          .rpt-logo { width: 52pt; height: auto; }
          .rpt-title-block { text-align: center; flex: 1; padding: 0 12pt; }
          .rpt-title { font-size: 14pt; font-weight: 700; color: #e35c0a; margin: 0; }
          .rpt-subtitle { font-size: 8pt; color: #555; margin: 2pt 0 0; }
          .rpt-period-badge {
            display: inline-block;
            background: #e35c0a;
            color: #fff;
            font-size: 8pt;
            font-weight: 700;
            padding: 2pt 8pt;
            border-radius: 4pt;
            margin-top: 4pt;
          }
          .rpt-meta { text-align: right; font-size: 7.5pt; color: #666; line-height: 1.5; }

          /* ─ Stats ─ */
          .rpt-stats {
            display: flex !important;
            gap: 8pt;
            margin-bottom: 10pt;
          }
          .rpt-stat-card {
            flex: 1;
            border: 1pt solid #e8e8e8;
            border-radius: 5pt;
            padding: 6pt 8pt;
          }
          .rpt-stat-label { font-size: 7pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4pt; color: #888; margin-bottom: 3pt; }
          .rpt-stat-main { font-size: 12pt; font-weight: 800; margin-bottom: 3pt; }
          .rpt-stat-detail { font-size: 7pt; color: #555; line-height: 1.6; }
          .s-entree { border-color: #16a34a; }
          .s-entree .rpt-stat-main { color: #16a34a; }
          .s-sortie { border-color: #dc2626; }
          .s-sortie .rpt-stat-main { color: #dc2626; }
          .s-solde .rpt-stat-main { color: #1d4ed8; }
          .s-solde-neg .rpt-stat-main { color: #dc2626; }

          /* ─ Tableau ─ */
          .rpt-tbl-title {
            font-size: 8.5pt;
            font-weight: 700;
            color: #333;
            margin-bottom: 4pt;
            border-left: 3pt solid #e35c0a;
            padding-left: 5pt;
          }
          .rpt-table { width: 100%; border-collapse: collapse; font-size: 8pt; }
          .rpt-table thead tr { background: #f1f5f9 !important; }
          .rpt-table th {
            padding: 5pt 6pt;
            text-align: left;
            font-weight: 700;
            font-size: 7.5pt;
            letter-spacing: 0.3pt;
            white-space: nowrap;
            color: #1e293b !important;
            border-bottom: 1.5pt solid #cbd5e1;
          }
          .rpt-table th.r, .rpt-table td.r { text-align: right; }
          .rpt-table td { padding: 5.5pt 6pt; border-bottom: 1px solid #cbd5e1; }
          .rpt-table tbody tr:nth-child(even) { background: #f8fafc; }
          .b-e { background: #dcfce7; color: #16a34a; font-weight: 700; padding: 1pt 5pt; border-radius: 3pt; font-size: 7pt; }
          .b-s { background: #fee2e2; color: #dc2626; font-weight: 700; padding: 1pt 5pt; border-radius: 3pt; font-size: 7pt; }
          .m-e { color: #16a34a; font-weight: 700; }
          .m-s { color: #dc2626; font-weight: 700; }

          /* ─ Pied ─ */
          .rpt-page-footer {
            position: fixed !important;
            bottom: 8mm !important;
            left: 14mm !important;
            right: 14mm !important;
            display: flex !important;
            justify-content: space-between;
            font-size: 7pt;
            color: #999;
            border-top: 0.5pt solid #cbd5e1;
            padding-top: 4pt;
            background: #fff;
            box-sizing: border-box;
          }
          .rpt-page-number::after {
            content: "Page " counter(page);
          }
        }
      `}</style>

      <div id="finance-print-root">

        {/* En-tête */}
        <div className="rpt-header">
          <img src="/MDT LOGO ORANGE.png" alt="Logo MDT" className="rpt-logo" />
          <div className="rpt-title-block">
            <p className="rpt-title">Rapport Financier</p>
            <p className="rpt-subtitle">Phila MDT — Tableau de bord financier</p>
            <span className="rpt-period-badge">Période : {periodLabel}</span>
          </div>
          <div className="rpt-meta">
            <p>Généré le {genAt}</p>
            <p>1 $ = {rates.CDF.toLocaleString('fr-FR')} FC</p>
            <p>1 € = {rates.EUR.toLocaleString('fr-FR')} $</p>
            <p style={{ fontWeight: 700, marginTop: '3pt' }}>{operations.length} opération{operations.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="rpt-stats">
          <div className="rpt-stat-card s-entree">
            <div className="rpt-stat-label">▲ Total Entrées (Recettes)</div>
            <div className="rpt-stat-main">{fmtAmt(Math.round(stats.entrees.equivalent), 'USD')}</div>
            <div className="rpt-stat-detail">
              USD : {fmtAmt(stats.entrees.USD, 'USD')} &nbsp;|&nbsp;
              CDF : {fmtAmt(stats.entrees.CDF, 'CDF')} &nbsp;|&nbsp;
              EUR : {fmtAmt(stats.entrees.EUR, 'EUR')}
            </div>
          </div>
          <div className="rpt-stat-card s-sortie">
            <div className="rpt-stat-label">▼ Total Sorties (Dépenses)</div>
            <div className="rpt-stat-main">{fmtAmt(Math.round(stats.sorties.equivalent), 'USD')}</div>
            <div className="rpt-stat-detail">
              USD : {fmtAmt(stats.sorties.USD, 'USD')} &nbsp;|&nbsp;
              CDF : {fmtAmt(stats.sorties.CDF, 'CDF')} &nbsp;|&nbsp;
              EUR : {fmtAmt(stats.sorties.EUR, 'EUR')}
            </div>
          </div>
          <div className={`rpt-stat-card ${stats.solde.equivalent >= 0 ? 's-solde' : 's-solde-neg'}`}>
            <div className="rpt-stat-label">= Solde Net</div>
            <div className="rpt-stat-main">
              {stats.solde.equivalent < 0 ? '− ' : ''}{fmtAmt(Math.abs(Math.round(stats.solde.equivalent)), 'USD')}
            </div>
            <div className="rpt-stat-detail">
              USD : {fmtAmt(stats.solde.USD, 'USD')} &nbsp;|&nbsp;
              CDF : {fmtAmt(stats.solde.CDF, 'CDF')} &nbsp;|&nbsp;
              EUR : {fmtAmt(stats.solde.EUR, 'EUR')}
            </div>
          </div>
        </div>

        {/* Tableau */}
        <p className="rpt-tbl-title">Détail des opérations</p>
        <table className="rpt-table">
          <thead>
            <tr>
              <th style={{ width: '3%' }}>#</th>
              <th style={{ width: '9%' }}>Date</th>
              <th style={{ width: '26%' }}>Description</th>
              <th style={{ width: '14%' }}>Catégorie</th>
              <th style={{ width: '12%' }}>Moyen paiement</th>
              <th className="r" style={{ width: '14%' }}>Montant</th>
              <th style={{ width: '6%' }}>Devise</th>
              <th style={{ width: '8%' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {operations.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '12pt', color: '#999', fontStyle: 'italic' }}>
                  Aucune opération pour cette période
                </td>
              </tr>
            ) : (
              operations.map((op, idx) => (
                <tr key={op.id}>
                  <td style={{ color: '#999', fontSize: '7.5pt' }}>{idx + 1}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(op.date)}</td>
                  <td>{op.description}</td>
                  <td>{op.categorie}</td>
                  <td style={{ textTransform: 'capitalize' }}>{op.moyen_paiement}</td>
                  <td className={`r ${op.type === 'entrée' ? 'm-e' : 'm-s'}`}>
                    {fmtAmt(op.montant, op.devise)}
                  </td>
                  <td style={{ fontWeight: 700 }}>{op.devise}</td>
                  <td><span className={op.type === 'entrée' ? 'b-e' : 'b-s'}>{op.type === 'entrée' ? 'Entrée' : 'Sortie'}</span></td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ border: 'none' }}>
              <td colSpan={8} style={{ height: '24pt', border: 'none', background: 'transparent' }}></td>
            </tr>
          </tfoot>
        </table>

        {/* Pied de page répétitif (affiché sur chaque page de l'impression) */}
        <div className="rpt-page-footer">
          <span>Phila MDT — Document confidentiel</span>
          <span>Rapport généré automatiquement — {genAt}</span>
          <span className="rpt-page-number"></span>
        </div>
      </div>
    </>
  )
}
