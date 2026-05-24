import { useEffect, useRef } from 'react'
import { Head, Link } from '@inertiajs/react'
import { ArrowRight, Calendar, Clock, MapPin, Mail, Play } from 'lucide-react'

const CulteCard = ({ day, title, description, time, location, highlight = false, tag = 'EN DIRECT' }: any) => {
  return (
    <div className={`p-8 rounded-2xl flex flex-col justify-between shadow-lg h-full min-h-[260px] transform hover:-translate-y-2 transition-transform duration-300 border ${highlight ? 'bg-[#C35100] text-white border-transparent' : 'bg-white border-slate-100 text-slate-900'}`}>
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className={`font-bold ${highlight ? 'text-white/90' : 'text-slate-600'} text-lg`}>{day}</span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${highlight ? 'bg-white/20 text-white' : 'bg-orange-50 text-accent-orange'}`}>
            {tag}
          </span>
        </div>
        <h3 className={`text-2xl font-serif font-black mb-8 ${highlight ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      </div>
      <div className="space-y-4">
        <div className={`flex items-center gap-3 text-sm ${highlight ? 'text-white/90' : 'text-slate-600'}`}>
          <span className="font-semibold">{description}</span>
          <Clock size={16} className="flex-shrink-0" />
          <span className="font-semibold">{time}</span>
        </div>
        <div className={`flex items-start gap-3 text-sm ${highlight ? 'text-white/80' : 'text-slate-500'}`}>
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <span className="leading-snug">{location}</span>
        </div>
      </div>
    </div>
  )
}

const MINISTRIES = [
  {
    id: 1,
    tag: "PRIÈRE",
    tagColor: "bg-[#2A9D8F]",
    title: "Cellule de Prière",
    desc: "Rejoignez-nous pour intercéder, chercher la face de Dieu et bâtir des fondations spirituelles solides.",
    image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    tag: "JEUNESSE",
    tagColor: "bg-[#3A86FF]", 
    title: "Génération PHILA",
    desc: "Un espace dynamique pour les 15-30 ans. Rencontres, débats et sorties spirituelles.",
    image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    tag: "ACADIS",
    tagColor: "bg-[#8338EC]", 
    title: "Académie Acadis",
    desc: "Formations bibliques et théologiques pour approfondir votre foi et votre connaissance de la Parole.",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    tag: "SOCIAL",
    tagColor: "bg-[#06D6A0]", 
    title: "Action Sociale",
    desc: "Impactons notre communauté à travers des œuvres de charité et d'assistance aux plus démunis.",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    tag: "CHORALE",
    tagColor: "bg-[#9D4EDD]", 
    title: "Chorale & Louange",
    desc: "Conduire le peuple de Dieu dans l'adoration avec excellence et passion musicale.",
    image: "https://images.unsplash.com/photo-1516280440502-1249911e86ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    tag: "ÉVANGÉLISATION",
    tagColor: "bg-[#FF5400]", 
    title: "Mission Locale",
    desc: "Annoncer la bonne nouvelle du salut et gagner des âmes pour Christ dans notre ville.",
    image: "https://images.unsplash.com/photo-1506869640319-fea1a278e0ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    tag: "EVENT",
    tagColor: "bg-[#FF006E]", 
    title: "Évènements Spéciaux",
    desc: "Conférences, séminaires et retraites pour l'édification globale du corps du Christ.",
    image: "https://images.unsplash.com/photo-1511795409834-4b95ba0ad1bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  }
]

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const slider = sliderRef.current
        const scrollDistance = slider.children[0]?.clientWidth ? slider.children[0].clientWidth + 24 : 344
        
        // If we reached the end, go back to start
        if (slider.scrollLeft >= (slider.scrollWidth - slider.clientWidth - 10)) {
          slider.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          // Otherwise scroll by the width of one card + gap
          slider.scrollTo({ left: slider.scrollLeft + scrollDistance, behavior: 'smooth' })
        }
      }
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head title="Phila Maison de Témoignages" />

      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center text-white text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Pour Cloudinary en production : 
              src="https://res.cloudinary.com/votre_id/video/upload/q_auto,f_auto/nom_de_votre_video.mp4" 
          */}
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/mdt-banner.jpg"
            className="w-full h-full object-cover"
          >
            <source src="/MARDI MALAKISI _ La connaissance qui libère.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight leading-tight">
            Bienvenu à la Maison de Témoignages
          </h1>
          <p className="text-lg md:text-3xl text-gray-200 mb-10 max-w-2xl mx-auto">Un lieu où Dieu Transforme Nos Vies en Témoignages Vivants</p>
          {/* <p className="text-lg md:text-3xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Rejoignez la Maison de Témoignages pour vivre une expérience authentique de louange, de partage et de foi.
          </p> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#cultes"
              className="px-8 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Nos cultes
            </Link>
            <Link
              href="/a-propos"
              className="px-8 py-3.5 bg-white text-primary font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              A propos de nous
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 lg:py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl rotate-3" />
            <img
              className="relative w-full aspect-[4/3] object-cover rounded-2xl shadow-2xl"
              src="/about-mdt.jpg"
              alt="Community"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-primary font-black uppercase tracking-widest text-xs">À propos de nous</span>
              <h2 className="text-slate-900 text-4xl md:text-5xl font-black font-serif leading-tight">Qui sommes-nous ?</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              L'église PHILA est bien plus qu'un bâtiment, c'est une communauté authentique, passionnée par les témoignages de vie et la croissance spirituelle. Nous croyons en une foi qui transforme les cœurs et restaure les familles.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              Depuis notre fondation, notre désir est de voir chacun découvrir son identité en Christ et manifester l'amour de Dieu dans sa sphère d'influence.
            </p>
            <Link href="/a-propos" className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
              En savoir plus sur nous
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Sermon Section */}
      <section className="py-12 lg:py-20 bg-background-off px-4 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="space-y-2">
              <span className="text-primary font-black uppercase tracking-widest text-xs">Message récent</span>
              <h2 className="text-slate-900 text-4xl font-black font-serif">Dernière prédication</h2>
              <p className="text-slate-500">Revivez notre dernier moment d'enseignement et d'édification.</p>
            </div>
            <Link href="/allContent" className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
              Voir tous les messages
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video max-w-5xl mx-auto">
             <iframe 
               className="w-full h-full"
               src="https://www.youtube.com/embed/cxQjanw5br8" 
               title="Dernière prédication"
               frameBorder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               allowFullScreen
             ></iframe>
          </div>
          
          <div className="mt-8 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-2xl font-black font-serif text-slate-900">Titre du Message : La puissance de la foi</h3>
              <p className="text-slate-600 leading-relaxed">
                Un message puissant sur la manière dont notre foi peut transformer les obstacles en opportunités de témoignage. Découvrez comment activer les promesses de Dieu dans votre quotidien.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Orateur</p>
                  <p className="font-bold text-slate-900">Pasteur Blonsky MBALA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="cultes" className="py-12 lg:py-20 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 lg:mb-12">
            <div className="space-y-2">
              <h2 className="text-slate-900 text-4xl font-black font-serif">Programme des cultes</h2>
              <p className="text-slate-500">Rejoignez-nous pour nos temps de célébration et d'enseignement.</p>
            </div>
            <Link href="/agenda" className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all">
              Voir tout l'agenda
              <Calendar size={18} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <CulteCard
              day="Dimanche"
              title="Culte Dominical"
              description="Adoration et Célébration"
              time="08h:00 - 10h:00"
              location="Temple de l'église située sur l'avenue Zoao n°25 Q/Matongo dans la commune de Kalamu"
              highlight
            />
            <CulteCard
              day="Mardi"
              title="Mardi Malakisi"
              description="Enseignements Bibliques"
              time="17:30 - 19h:30"
              location="Temple de l'église & Live"
              tag="Enseignement"
            />
            <CulteCard
              day="Jeudi"
              title="Jeudi Etoko"
              description="Moment des fortes prières sur les nattes"
              time="17h:30 - 19:30"
              location="Temple de l'église & Live"
              tag="Intercession"
            />
          </div>
        </div>
      </section>

      {/* Agenda Preview Section */}
      <section className="py-12 lg:py-20 bg-background-off px-4 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="space-y-2">
              <span className="text-primary font-black uppercase tracking-widest text-xs">Agenda de la semaine</span>
              <h2 className="text-slate-900 text-4xl font-black font-serif">Cette semaine à Phila MDT</h2>
              <p className="text-slate-500">Ne manquez aucun rendez-vous spirituel · Chaque semaine, une nouvelle rencontre avec Dieu.</p>
            </div>
            <Link
              href="/agenda"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/20 shrink-0"
            >
              Voir l'agenda complet
              <Calendar size={18} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { day: "Lundi",    title: "Intercession Matinale",  time: "06:00 – 07:00", tag: "Prière",       tagBg: "bg-blue-100 text-blue-700",    accent: "border-blue-200"   },
              { day: "Mardi",    title: "Mardi Malakisi",         time: "17:30 – 19:30", tag: "Enseignement", tagBg: "bg-primary text-white",        accent: "border-primary/30", highlight: true },
              { day: "Mercredi", title: "Réunion des Couples",    time: "18:00 – 19:30", tag: "Famille",      tagBg: "bg-pink-100 text-pink-700",   accent: "border-pink-200"   },
              { day: "Jeudi",    title: "Jeudi Etoko",            time: "17:30 – 19:30", tag: "Intercession", tagBg: "bg-orange-500 text-white",     accent: "border-orange-200", highlight: true },
              { day: "Vendredi", title: "Génération PHILA",       time: "17:30 – 19:30", tag: "Jeunesse",    tagBg: "bg-purple-100 text-purple-700",accent: "border-purple-200" },
              { day: "Dimanche", title: "Culte Dominical",        time: "08:00 – 10:00", tag: "Célébration",  tagBg: "bg-primary text-white",        accent: "border-primary/30", highlight: true },
            ].map((item, i) => (
              <Link
                key={i}
                href="/agenda"
                className={`group p-6 rounded-2xl border-2 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col gap-4 ${
                  item.highlight ? item.accent + ' shadow-md' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${item.tagBg}`}>
                    {item.tag}
                  </span>
                  <span className="text-slate-400 text-sm font-bold">{item.day}</span>
                </div>
                <h3 className={`text-xl font-black font-serif transition-colors ${
                  item.highlight ? 'text-primary' : 'text-slate-900 group-hover:text-primary'
                }`}>
                  {item.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-sm">
                    <Clock size={14} className="text-primary" />
                    <span className="font-semibold">{item.time}</span>
                  </div>
                  <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Club 365 Section */}
      <section className="py-12 lg:py-20 bg-slate-900 px-4 overflow-hidden relative">
        {/* Decorative glows */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/15 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left – Description */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
              </span>
              <span className="text-primary-light font-black uppercase tracking-widest text-xs">
                Formation Biblique · Maturité Chrétienne
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-white text-4xl md:text-5xl font-black font-serif leading-tight">
                Club <span className="text-primary-light">365</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Le Club 365 est notre programme de lecture intégrale de la Bible en une année. Chaque jour, un passage, un chapitre, une rencontre avec la Parole de Dieu. Un voyage spirituel structuré pour grandir en connaissance, en foi et en maturité chrétienne.
              </p>
              <p className="text-white/60 text-base leading-relaxed">
                Que vous soyez débutant ou croyant aguerri, le Club 365 vous guide pas à pas à travers les 66 livres de la Bible. <span className="text-white font-semibold">Une discipline quotidienne qui transforme votre vie.</span>
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <p className="text-white/50 uppercase text-xs font-black tracking-widest">Le défi en chiffres</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "66", label: "Livres de la Bible" },
                  { value: "1 189", label: "Chapitres à lire" },
                  { value: "365", label: "Jours pour y arriver" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 text-center gap-1"
                  >
                    <p className="text-primary-light font-black text-2xl leading-none">{stat.value}</p>
                    <p className="text-white/50 text-[10px] uppercase tracking-wider font-bold leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transform duration-300"
            >
              Rejoindre le Club 365
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Right – Club 365 Image */}
          <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl group">
            <img
              src="/temple-jeudi-etoko.jpeg"
              alt="Club 365 - Lecture intégrale de la Bible"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
            {/* Badge overlay */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-white text-xs font-bold">Programme annuel en cours</span>
            </div>
            {/* Club 365 brand overlay */}
            <div className="absolute top-6 right-6 bg-primary rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-white font-black text-2xl leading-none font-serif">club</p>
              <p className="text-white/90 font-black text-3xl leading-none">365</p>
            </div>
            {/* Bottom card */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-2">
                <p className="text-primary-light font-black uppercase text-xs tracking-widest">Guide de la lecture annuelle</p>
                <p className="text-white font-bold text-xl font-serif">Toute la Bible en 365 jours</p>
                <p className="text-white/60 text-sm">Formation · Maturité · Connaissance · Transformation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministries Slider Section */}
      <section className="py-12 lg:py-20 bg-background-off px-4 overflow-hidden border-t border-slate-100">
        <div className="max-w-6xl mx-auto mb-8 lg:mb-10">
          <h2 className="text-slate-900 text-4xl font-black font-serif mb-2">Nos Ministères</h2>
          <p className="text-slate-500">Il y a une place pour chacun à l'Église Phila MDT.</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div ref={sliderRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MINISTRIES.map((min) => (
                <div key={min.id} className="shrink-0 w-[320px] md:w-[360px] snap-start bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group">
                <div className="h-48 relative overflow-hidden bg-slate-100">
                  <img src={min.image} alt={min.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute bottom-3 left-4 px-3 py-1 rounded-[6px] text-[10px] font-black uppercase tracking-wider text-white ${min.tagColor}`}>
                    {min.tag}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-serif font-black text-xl text-slate-900 mb-2 group-hover:text-primary transition-colors">{min.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-grow">{min.desc}</p>
                  <Link href="/ministries" className="text-primary font-bold text-sm hover:text-primary-light transition-colors flex items-center gap-1 w-max group-hover:gap-2">
                    En savoir plus
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cellules Section */}
      <section className="py-12 lg:py-20 bg-primary/5 px-4 overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left – Image */}
          <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden shadow-2xl group order-2 lg:order-1">
            <img
              src="/hospitalite-mdt.jpeg"
              alt="Cellules de maison"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-2 shadow-lg">
                <p className="text-primary font-black uppercase text-xs tracking-widest">Proximité</p>
                <p className="text-slate-900 font-bold text-xl font-serif">Une famille spirituelle près de chez vous</p>
                <p className="text-slate-600 text-sm">Des rencontres conviviales pour grandir ensemble</p>
              </div>
            </div>
          </div>

          {/* Right – Description */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-full">
              <span className="font-black uppercase tracking-widest text-xs">Communion Fraternelle</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-slate-900 text-4xl md:text-5xl font-black font-serif leading-tight">
                Nos Cellules de <span className="text-primary">Maison</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                L'église, ce n'est pas seulement le dimanche au temple ! Rejoignez l'une de nos cellules réparties à travers la ville pour vivre la communion fraternelle, partager la Parole et prier ensemble dans un cadre plus intime.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Les cellules de maison sont le lieu idéal pour grandir spirituellement, tisser des liens forts avec d'autres croyants et développer vos dons. Il y a forcément une cellule près de chez vous.
              </p>
            </div>

            <Link
              href="/cellules"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
            >
              En savoir plus
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto rounded-3xl bg-primary text-white p-8 relative overflow-hidden sm:p-12 lg:p-16 lg:py-20 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-bold tracking-wider uppercase mb-2">
                <Mail size={16} /> Restons Connectés
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-serif leading-tight">Abonnez-vous à notre Newsletter</h2>
              <p className="text-lg text-white/80 leading-relaxed max-w-md">
                Recevez nos dernières actualités, des mots d'encouragement et nos annonces directement dans votre boîte e-mail.
              </p>
            </div>
            
            <div className="w-full max-w-md md:ml-auto">
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Votre adresse e-mail..." 
                  className="w-full px-6 py-4 rounded-xl text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all font-medium border-0"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full px-6 py-4 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  S'inscrire
                </button>
                <p className="text-xs text-white/60 text-center mt-2">Nous respectons votre vie privée. Vous pouvez vous désabonner à tout moment.</p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
