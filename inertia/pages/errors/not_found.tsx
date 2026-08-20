import { Head, Link } from '@inertiajs/react'

export default function NotFound() {
  return (
    <>
      <Head title="Page non trouvée — Phila MDT">
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold font-serif">
            404
          </div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif">Page non trouvée</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#7a3218] hover:bg-[#5b2010] text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
