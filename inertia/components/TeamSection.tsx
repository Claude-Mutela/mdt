// import { Link } from '@inertiajs/react'

export const teamMembers = [
  {
    role: 'BERGER PRINCIPAL',
    name: 'Pasteur Fondateur',
    description: "Visionnaire et serviteur du peuple de Dieu, il guide l'église PHILA depuis sa création avec humilité et ferveur.",
    image: '/about-mdt.jpg',
  },
  {
    role: 'ANCIENS & COLLABORATEURS',
    name: 'Équipe Pastorale',
    description: "Une équipe dédiée qui soutient le ministère, accompagne les membres et veille au bon déroulement des activités.",
    image: '/aksanti-mungu-mdt.jpeg',
  },
  {
    role: 'FEMMES DE VALEUR',
    name: 'Ministère des Femmes',
    description: "Des femmes engagées, intercédant pour les familles et servant la communauté avec grâce et détermination.",
    image: '/merci-mdt.jpeg',
  }
]

export default function TeamSection() {
  return (
    <section className="py-16 lg:py-24 bg-[#FCFCFD]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#7a3218] uppercase">Ceux qui servent</span>
          <h2 className="text-3xl md:text-4xl font-black font-serif text-slate-900">Notre équipe pastorale</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Des serviteurs dévoués qui accompagnent chaque membre avec amour, sagesse et humilité.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 text-left">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="group flex flex-col">
              <div className="relative overflow-hidden rounded-[20px] aspect-[4/5] sm:aspect-[3/4] mb-5 shadow-sm">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-xs font-bold uppercase tracking-wide text-[#E78E24] mt-1">{member.role}</p>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed hidden sm:block">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
