import { ArrowRight, Users, Calendar, BookOpen, Star } from 'lucide-react'
import { Link } from '@inertiajs/react'

export default function HeroAbout() {
  return (
    <header className="relative">
      <div className="relative h-[400px] md:h-[500px] lg:h-[560px] flex items-center justify-center text-center text-white overflow-hidden">
        <img src="/about-mdt.jpg" alt="PHILA banner" className="absolute inset-0 w-full h-full object-cover transform scale-100 md:scale-105 lg:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />

        <div className="relative z-10 max-w-6xl px-6 sm:px-8 lg:px-12">
          {/* <div className="flex justify-center">
            <span className="inline-block bg-white/10 text-white/90 uppercase text-xs tracking-widest px-4 py-2 rounded-full">Qui sommes-nous</span>
          </div> */}

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-black leading-tight">
            L'Église PHILA —
            <br /> Maison de Témoignages
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-lg md:text-xl text-white/90">
            Une communauté authentique, ancrée dans la Parole, passionnée par Dieu et engagée pour la cité.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact" className="px-8 py-3.5 bg-white text-[#7a3218] font-semibold rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
              Nous contacter
            </Link>
            <a href="#nos-statistiques" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white/12 transition">Découvrir</a>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div id="nos-statistiques" className="bg-[#4b1f17] text-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
          <div>
            <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <Users size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-black">500+</div>
            <div className="text-xs mt-1 uppercase tracking-widest text-white/80">Membres actifs</div>
          </div>

          <div>
            <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <Calendar size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-black">2025</div>
            <div className="text-xs mt-1 uppercase tracking-widest text-white/80">Fondée en</div>
          </div>

          <div>
            <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <BookOpen size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-black">3</div>
            <div className="text-xs mt-1 uppercase tracking-widest text-white/80">Cultes par semaine</div>
          </div>

          <div>
            <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
              <Star size={20} />
            </div>
            <div className="text-3xl md:text-4xl font-black">8</div>
            <div className="text-xs mt-1 uppercase tracking-widest text-white/80">Ministères actifs</div>
          </div>
        </div>
      </div>
    </header>
  )
}
