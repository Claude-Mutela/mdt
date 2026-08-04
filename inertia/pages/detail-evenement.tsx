import { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Calendar, MapPin, Clock, Link2, Check } from 'lucide-react'

interface Event {
  title: string
  slug: string
  status: 'ongoing' | 'upcoming' | 'past'
  date: string
  location: string
  description: string
  content: string
  tag: string
  image: string
}

interface Props {
  event: Event
}

export default function DetailEvenement({ event }: Props) {
  const [copied, setCopied] = useState(false)

  const statusLabels = {
    ongoing: { label: 'En cours', color: 'bg-green-500' },
    upcoming: { label: 'À venir', color: 'bg-primary' },
    past: { label: 'Passé', color: 'bg-slate-400' },
  }

  // Helper pour garantir des URLs absolues (exigées par Facebook, X, LinkedIn, WhatsApp)
  const getAbsoluteUrl = (path?: string) => {
    if (!path) return 'https://www.philamdt.church/mdt-banner.jpg'
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const origin =
      typeof window !== 'undefined' &&
      window.location.origin.includes('http') &&
      !window.location.origin.includes('localhost') &&
      !window.location.origin.includes('127.0.0.1')
        ? window.location.origin
        : 'https://www.philamdt.church'
    return `${origin}${path.startsWith('/') ? '' : '/'}${path}`
  }

  // URL canonique et publique de l'événement (Facebook/X exigent une URL publiquement accessible)
  const isLocal =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

  const publicPageUrl = isLocal
    ? `https://www.philamdt.church/evenements/${event.slug}`
    : typeof window !== 'undefined'
      ? window.location.href
      : `https://www.philamdt.church/evenements/${event.slug}`

  const absoluteImageUrl = getAbsoluteUrl(event.image)
  const shareText = `${event.title} — ${event.description ? event.description.slice(0, 120) : ''}`

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicPageUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicPageUrl)}`,
    x: `https://x.com/intent/tweet?url=${encodeURIComponent(publicPageUrl)}&text=${encodeURIComponent(shareText)}`,
  }

  const handleShare = async (platform: 'facebook' | 'linkedin' | 'x') => {
    // Si l'API Web Share est dispo sur mobile, on l'utilise pour une intégration native parfaite
    if (typeof navigator !== 'undefined' && navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: event.title,
          text: shareText,
          url: publicPageUrl,
        })
        return
      } catch {
        // Fallback sur le lien web classique si l'utilisateur annule
      }
    }
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer,width=600,height=500')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicPageUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      const el = document.createElement('input')
      el.value = publicPageUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <>
      <Head title={`${event.title} - Phila Maison de Témoignages`}>
        <meta
          name="description"
          content={
            event.description
              ? event.description.slice(0, 160)
              : `Détails de l'événement "${event.title}" organisé par la Phila Maison de Témoignages.`
          }
        />
        {/* Open Graph — partage réseaux sociaux (FB, LinkedIn, WhatsApp) */}
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Phila Maison de Témoignages" />
        <meta property="og:url" content={publicPageUrl} />
        <meta property="og:title" content={event.title} />
        <meta
          property="og:description"
          content={event.description ? event.description.slice(0, 200) : `Événement organisé par Phila Maison de Témoignages.`}
        />
        <meta property="og:image" content={absoluteImageUrl} />
        <meta property="og:image:secure_url" content={absoluteImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card (X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={publicPageUrl} />
        <meta name="twitter:title" content={event.title} />
        <meta
          name="twitter:description"
          content={event.description ? event.description.slice(0, 200) : `Événement organisé par Phila Maison de Témoignages.`}
        />
        <meta name="twitter:image" content={absoluteImageUrl} />
      </Head>

      <main className="bg-white min-h-screen">
        {/* Banner Section */}
        <div className="relative h-[45vh] md:h-[60vh] overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
            <div className="max-w-5xl mx-auto space-y-6">
              <Link
                href="/evenements"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm font-bold group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Retour à l'agenda
              </Link>

              <div className="space-y-4">
                <span
                  className={`${statusLabels[event.status].color} text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-xl uppercase tracking-widest inline-block shadow-lg`}
                >
                  {statusLabels[event.status].label}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-black font-serif text-white leading-tight max-w-4xl">
                  {event.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* content Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-12">
              <div className="prose prose-slate prose-lg max-w-none">
                <h2 className="text-2xl md:text-4xl font-black font-serif text-slate-900 mb-8 pb-4 border-b border-slate-100">
                  Détails de l'événement
                </h2>
                <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-8">
                  {event.description}
                </p>
                <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {event.content}
                </div>
              </div>

              {/* Share */}
              <div className="pt-10 border-t border-slate-100 space-y-4">
                <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                  Partager cet événement
                </span>
                <div className="flex flex-wrap gap-3">

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    aria-label="Partager sur Facebook"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#1877F2] text-white font-bold text-sm hover:bg-[#1465d1] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  >
                    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                    Facebook
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={() => handleShare('linkedin')}
                    aria-label="Partager sur LinkedIn"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0A66C2] text-white font-bold text-sm hover:bg-[#084d93] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  >
                    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    LinkedIn
                  </button>

                  {/* X / Twitter */}
                  <button
                    onClick={() => handleShare('x')}
                    aria-label="Partager sur X"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  >
                    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                    X
                  </button>

                  {/* Copier le lien */}
                  <button
                    onClick={handleCopy}
                    aria-label="Copier le lien"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {copied ? <Check size={17} /> : <Link2 size={17} />}
                    {copied ? 'Copié !' : 'Copier le lien'}
                  </button>

                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4 sticky top-28">
              <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 shadow-sm space-y-10">
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold font-serif text-slate-900 border-b pb-4 border-slate-200">
                    Infos Pratiques
                  </h3>

                  <SidebarItem
                    icon={<Calendar size={22} />}
                    title="Date"
                    desc={event.date.split('à')[0]}
                  />
                  <SidebarItem
                    icon={<Clock size={22} />}
                    title="Heure"
                    desc={event.date.split('à')[1] || 'Toute la journée'}
                  />
                  <SidebarItem icon={<MapPin size={22} />} title="Lieu" desc={event.location} />
                </div>

                <div className="space-y-4 pt-6">
                  <Link
                    href="/contact"
                    className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-light transition-all flex items-center justify-center gap-2 group"
                  >
                    Nous Contacter
                    <ArrowLeft
                      className="rotate-180 group-hover:translate-x-1 transition-transform"
                      size={18}
                    />
                  </Link>
                  <p className="text-[10px] text-center text-slate-400 font-medium uppercase tracking-widest">
                    Entrée libre selon disponibilité
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Placeholder Section */}
        {/* <section className="bg-slate-50 border-y border-slate-100 overflow-hidden">
          <div className="max-w-5xl mx-auto py-20 px-6 space-y-10">
             <div className="flex justify-between items-end">
                <div className="space-y-2">
                   <h2 className="text-3xl font-bold font-serif">S'y rendre</h2>
                   <p className="text-slate-500">Localisez le lieu de l'événement sur la carte.</p>
                </div>
                <button className="text-primary font-bold hover:underline text-sm uppercase tracking-widest">Calculer l'itinéraire</button>
             </div>
             <div className="h-96 rounded-[40px] bg-slate-200 shadow-inner flex items-center justify-center text-slate-400 italic">
                <MapPin size={48} className="text-slate-300 mr-4" />
                Plan interactif indisponible
             </div>
          </div>
        </section> */}
      </main>
    </>
  )
}

function SidebarItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-6 items-start">
      <div className="w-12 h-12 rounded-2xl bg-white text-primary shadow-sm flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-lg font-bold text-slate-900 leading-tight">{desc}</p>
      </div>
    </div>
  )
}
