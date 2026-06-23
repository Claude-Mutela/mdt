import HeroAbout from '../components/HeroAbout'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { Eye, Globe, Heart, ArrowRight, ExternalLink } from 'lucide-react'


const pastoralCouple = {
  nom: 'Blonsky & Lydia Mbala',
  role: 'Couple Pastoral',
  photo: '/couple_blonsky_mbala.jpeg',
}

const faqs = [
  {
    question: 'Qui peut rejoindre Phila Maison de Témoignages ?',
    reponse:
      'Tout le monde est le bienvenu ! Peu importe votre parcours, votre passé ou votre niveau de foi, nos portes sont ouvertes à toute personne sincèrement désireuse de rencontrer Dieu et de grandir spirituellement.',
  },
  {
    question: 'À quelle fréquence ont lieu les cultes ?',
    reponse:
      'Nous tenons des cultes chaque dimanche matin à 8h00, ainsi que des réunions de d\'Enseignement MALAKISI mardi à partir de 17h30, prière le jeudi soir à 17h30. Des groupes de maison (Cellules) se réunissent également en semaine dans différents quartiers.',
  },
  {
    question: 'Y a-t-il des activités pour les enfants et les jeunes ?',
    reponse:
      'Oui ! Nous avons un département jeunesse actif avec des programmes adaptés pour les enfants, les adolescents et les jeunes adultes. Ces activités incluent des études bibliques, des camps et des événements sociaux.',
  },
  {
    question: "Comment puis-je m'impliquer dans l'église ?",
    reponse:
      "Il existe de nombreuses façons de servir : la louange, l'accueil, les groupes de cellule, les actions sociales et bien plus encore. Parlez à l'un de nos responsables après un culte et nous vous orienterons vers le bon département.",
  },
  {
    question: "L'église propose-t-elle un accompagnement pastoral ?",
    reponse:
      "Absolument. Notre équipe pastorale est disponible pour vous accompagner dans les moments difficiles, que ce soit pour un counseling, une prière personnelle ou un suivi spirituel. Contactez-nous pour prendre rendez-vous.",
  },
  {
    question: "Comment faire un don à l'église ?",
    reponse:
      "Vous pouvez contribuer lors de nos cultes via les quêtes habituelles, Mobile Money, virement bancaire, le don en ligne à partir du site sur la page contact ou nous contacter directement pour les dons en nature. Chaque contribution soutient notre mission et nos actions communautaires.",
  },
]

export default function About() {
  return (
    <>
      <Head title="À propos - Phila Maison de Témoignages" />
      <main>
        <HeroAbout />

        <section className="py-12 lg:py-20 bg-white px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black font-serif">A propos de nous</h2>
              <p className="text-slate-600">Depuis notre fondation en 2025, Phila Maison de Témoignages a pour vocation de voir des vies transformées. Nous sommes une communauté engagée qui met la Parole en action et qui cherche à impacter notre cité par des témoignages vivants.</p>
              <p className="text-slate-600">Ici, vous trouverez des programmes pour tous les âges : cultes, groupes de maison, actions sociales et formations spirituelles.</p>
            </div>

            <div className="relative">
              <img src="/aksanti-mungu-mdt.jpeg" alt="Aksanti Mungu" className="w-full h-80 object-cover rounded-2xl shadow-lg" />
            </div>
          </div>
        </section>

        {/* Filiation & Origines (Généalogie Spirituelle) */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-background-off border-t border-[#EAE5DF] px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-primary font-black uppercase tracking-widest text-xs">Notre Filiation Spirituelle</span>
              <h2 className="text-slate-900 text-3xl md:text-4xl font-black font-serif">D'où vient Phila Maison de Témoignages ?</h2>
              <p className="text-slate-500 text-base md:text-lg">
                Découvrez la généalogie de notre vision spirituelle. Une vision céleste transmise, établie et propagée pour la gloire de Dieu.
              </p>
            </div>

            {/* Arbre Généalogique Visuel */}
            <div className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-16 lg:gap-y-0 gap-x-8 lg:gap-x-16 relative z-10">
                
                {/* 1. Centre Missionnaire Philadelphie (CMP) */}
                <div className="group bg-white rounded-3xl border-2 border-[#EAE5DF] hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                  
                  <div>
                    {/* Image Header */}
                    <div className="relative h-72 w-full overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src="/rolland&viviane.png" 
                        alt="Couple Roland et Viviane Dalo" 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                      {/* Badge de génération */}
                      <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                        Génération 1 — L'Église de la Vision
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black font-serif text-slate-900 group-hover:text-primary transition-colors">
                          Centre Missionnaire Philadelphie
                        </h3>
                        <p className="text-xs text-primary font-bold tracking-wider uppercase">CMP — Église Mère</p>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        L'histoire commence au Centre Missionnaire Philadelphie (CMP), sous l'impulsion spirituelle de l'Apôtre Roland Dalo. C'est l'église fondatrice de la vision, où les fondements et la doctrine d'impact ont été plantés.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-0">
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <a 
                        href="https://eglisecmp.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary-dark transition-colors"
                      >
                        <span>Visiter le site</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Connecteur 1 (Vers Gen 2) */}
                  {/* Sur desktop : ligne horizontale avec flèche simple */}
                  <div className="hidden lg:flex absolute top-1/2 left-full -translate-y-1/2 w-16 h-6 z-20 items-center justify-center pointer-events-none">
                    <svg className="w-full h-full text-primary/70 animate-pulse" fill="none" viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12H60M60 12L52 6M60 12L52 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="4" cy="12" r="3.5" fill="currentColor" />
                    </svg>
                  </div>
                  
                  {/* Sur mobile : ligne verticale avec flèche simple arrêtée avant le badge */}
                  <div className="lg:hidden absolute left-1/2 top-full -translate-x-1/2 w-6 h-16 z-20 flex items-center justify-center pointer-events-none">
                    <svg className="w-full h-full text-primary/70 animate-pulse" fill="none" viewBox="0 0 24 64" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V44M12 44L6 36M12 44L18 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="4" r="3.5" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                {/* 2. Phila Cité d'Exaucement (PCE) */}
                <div className="group bg-white rounded-3xl border-2 border-[#EAE5DF] hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                  
                  <div>
                    {/* Image Header */}
                    <div className="relative h-72 w-full overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src="/athoms&nadege.png" 
                        alt="Couple Athoms et Nadège Mbuma" 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                      {/* Badge de génération */}
                      <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                        Génération 2 — La Filiation Directe
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black font-serif text-slate-900 group-hover:text-primary transition-colors">
                          Phila Cité d'Exaucement
                        </h3>
                        <p className="text-xs text-primary font-bold tracking-wider uppercase">Phila CE — Église Fille</p>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        De la vision du CMP est née Phila Cité d'Exaucement (Phila CE), dirigée par le couple Pastoral Athoms et Nadège Mbuma. C’est dans ce foyer ardent d'amour et d’adoration que notre communauté a puisé son élan direct.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-0">
                    <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                      <a 
                        href="https://ce.church/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary-dark transition-colors"
                      >
                        <span>Visiter le site</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Connecteur 2 (Vers Gen 3) */}
                  {/* Sur desktop : ligne horizontale avec flèche simple */}
                  <div className="hidden lg:flex absolute top-1/2 left-full -translate-y-1/2 w-16 h-6 z-20 items-center justify-center pointer-events-none">
                    <svg className="w-full h-full text-primary/70 animate-pulse" fill="none" viewBox="0 0 64 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 12H60M60 12L52 6M60 12L52 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="4" cy="12" r="3.5" fill="currentColor" />
                    </svg>
                  </div>
                  
                  {/* Sur mobile : ligne verticale avec flèche simple arrêtée avant le badge */}
                  <div className="lg:hidden absolute left-1/2 top-full -translate-x-1/2 w-6 h-16 z-20 flex items-center justify-center pointer-events-none">
                    <svg className="w-full h-full text-primary/70 animate-pulse" fill="none" viewBox="0 0 24 64" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V44M12 44L6 36M12 44L18 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="4" r="3.5" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                {/* 3. Phila Maison de Témoignages (PMT) */}
                <div className="group bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border-2 border-primary hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
                  
                  <div>
                    {/* Image Header */}
                    <div className="relative h-72 w-full overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src="/Couple_Bonsky_mbala.jpeg" 
                        alt="Couple Blonsky et Lydia Mbala" 
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                      />
                      {/* Badge de génération */}
                      <div className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md animate-pulse">
                        Génération 3 — Notre Communauté
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black font-serif text-slate-900 group-hover:text-primary transition-colors">
                          Phila Maison de Témoignages
                        </h3>
                        <p className="text-xs text-primary font-bold tracking-wider uppercase">Phila MDT — Notre Église</p>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed">
                        Dernière-née de cette lignée spirituelle, notre église locale sous la conduite pastorale s'établit pour proclamer la grandeur de Dieu. Notre mission est de transformer les vies en de véritables monuments de témoignages.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-0">
                    <div className="pt-6 border-t border-primary/20 flex items-center justify-between">
                      <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        Vision Vivante
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Identity / Vision & Mission */}
        <section className="py-12 lg:py-20 bg-background-off px-4">
          <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-slate-900 text-4xl font-black font-serif">Notre Identité</h2>
              <p className="text-slate-500 text-lg">Ce qui nous anime et constitue le fondement de notre marche ensemble.</p>
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Vision — card primary */}
              <div className="relative p-10 rounded-3xl bg-primary text-white overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <Eye size={28} />
                  </div>
                  <h3 className="text-2xl font-black font-serif mb-4">Notre Vision</h3>
                  <p className="text-white/85 leading-relaxed">
                    Voir des vies brisées transformées en témoignages vivants par la puissance de Dieu, et que ces témoignages deviennent une lumière pour Kinshasa, la RDC et les nations.
                  </p>
                </div>
              </div>

              {/* Mission — card outline */}
              <div className="relative p-10 rounded-3xl border-2 border-primary/20 bg-white overflow-hidden hover:border-primary transition-colors">
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-primary/5" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Globe size={28} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-black font-serif mb-4">Notre Mission</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Prêcher l'évangile avec authenticité, faire des disciples engagés, et impacter notre génération en relevant des hommes et des femmes qui transforment leur environnement.
                  </p>
                </div>
              </div>
            </div>

            {/* Nos Valeurs — grille 2×2 */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart size={20} className="text-primary" />
                </div>
                <h3 className="text-2xl font-black font-serif">Nos Valeurs</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  {
                    title: 'Vous êtes au cœur du plan de Dieu',
                    desc: 'À PHILA Maison de Témoignages, nous croyons que vous n\'êtes pas ici par hasard. Vous êtes au centre du programme divin. Notre mission est de vous accompagner dans votre marche avec Dieu, vous aider à découvrir votre identité d\'enfant du Royaume, et à activer les dons et talents que le Seigneur a déposés en vous. Ici, vous êtes accueilli(e), reconnu(e) et propulsé(e).',
                  },
                  {
                    title: 'Une croissance spirituelle guidée et profonde',
                    desc: 'Nos programmes spirituels ont été conçus pour vous aider à approfondir votre relation avec Dieu, à grandir en grâce et à développer une foi solide, joyeuse et décomplexée. Notre objectif : que chaque membre devienne un témoin vivant de Christ, dans sa famille, dans son travail et dans sa génération.',
                  },
                  {
                    title: 'Une église qui valorise la famille',
                    desc: 'Nous croyons qu\'une famille forte est une bénédiction pour l\'Église et pour la société. C\'est pourquoi nous encourageons le service en couple, le soutien mutuel et l\'unité spirituelle dans les foyers. À travers des programmes adaptés, nous marchons aux côtés des familles pour bâtir des fondations solides, équilibrées et alignées sur la Parole.',
                  },
                  {
                    title: 'Nous vous accueillons avec joie',
                    desc: 'Envie d\'en savoir plus ou de faire un premier pas ? Nous serons ravis de vous rencontrer à PHILA Maison de Témoignages. Prenez contact avec notre équipe d\'accueil, visitez-nous en personne, ou fixez un rendez-vous pour une rencontre fraternelle et inspirante.',
                  },
                ].map((v, i) => (
                  <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <ArrowRight size={14} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{v.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Couple Pastoral ────────────────────────────────────────── */}
        <section className="py-24 bg-background-off px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-primary font-black uppercase tracking-widest text-xs">Ceux qui nous dirigent</span>
              <h2 className="text-slate-900 text-4xl font-black font-serif">Notre couple pastoral</h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Des serviteurs dévoués qui accompagnent chaque membre avec amour, sagesse et humilité.
              </p>
            </div>
            
            <div className="max-w-md mx-auto group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] shadow-2xl">
                <img
                  src={pastoralCouple.photo}
                  alt={pastoralCouple.nom}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col text-center">
                  <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2">{pastoralCouple.role}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-white">{pastoralCouple.nom}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        
        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <FaqSection />

        {/* ── CTA final ─────────────────────────────────────────────── */}
        {/* <section className="py-24 bg-primary px-4">
          <div className="max-w-3xl mx-auto text-center text-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-black font-serif leading-tight">
              Prêt à nous rejoindre ?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Peu importe où vous en êtes dans votre parcours de foi, il y a une place pour vous à l'Église PHILA. Venez tel que vous êtes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/activities"
                className="bg-white text-primary h-14 px-10 rounded-xl font-bold transition-all shadow-xl hover:bg-slate-100 transform hover:-translate-y-1 flex items-center justify-center"
              >
                Voir nos horaires
              </Link>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white h-14 px-10 rounded-xl font-bold transition-all flex items-center justify-center backdrop-blur-md"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </section> */}

      </main>
    </>
  )
}

/* ── Composant accordéon FAQ ─────────────────────────────────────────── */
function FaqSection() {
  const [ouvert, setOuvert] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background-off px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="text-center space-y-3">
          <span className="text-primary font-black uppercase tracking-widest text-xs">
            Vos questions
          </span>
          <h2 className="text-slate-900 text-4xl font-black font-serif">
            Foire aux questions
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Trouvez rapidement les réponses aux questions les plus fréquemment posées sur notre communauté.
          </p>
        </div>

        {/* Accordéon */}
        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {faqs.map((faq, i) => {
            const estOuvert = ouvert === i
            return (
              <div key={i} className="bg-background-off">
                <button
                  onClick={() => setOuvert(estOuvert ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-background-off hover:bg-orange-50 transition-colors duration-200"
                  aria-expanded={estOuvert}
                >
                  <span className="font-semibold text-slate-800 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      estOuvert
                        ? 'border-primary bg-primary text-white rotate-45'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    estOuvert ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-slate-500 text-sm leading-relaxed">
                    {faq.reponse}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Lien contact */}
        <p className="text-center text-slate-500 text-sm">
          Vous ne trouvez pas votre réponse ?{' '}
          <a
            href="/contact"
            className="text-primary font-semibold hover:underline"
          >
            Contactez-nous →
          </a>
        </p>
      </div>
    </section>
  )
}
