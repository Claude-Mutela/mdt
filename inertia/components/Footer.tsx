import { Link } from '@inertiajs/react'
import { MapPin, Phone, Mail } from 'lucide-react'

// SVG Icons for social links
const FacebookIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
)

const YoutubeIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
)

const InstagramIcon = ({ size = 20, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const TikTokIcon = ({ size = 20, className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export function Footer() {
  return (
    <footer className="bg-[#1C1613] text-white pt-20 pb-16">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Column 1: Logo, Quote, Socials */}
          <div className="space-y-6 md:pr-4">
            <Link href="/" className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                <img src="/log-phila-mdt.png" alt="Phila MDT Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-serif font-bold text-xl leading-tight text-white hover:text-gray-200 transition-colors">
                Phila Maison de<br/>Témoignages
              </span>
            </Link>
            
            <div className="space-y-2 text-[#b0a9a4] mt-8">
              <p className="italic text-sm leading-relaxed font-serif">
                "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux."
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                - MATTHIEU 18:20
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <a href="https://www.facebook.com/share/17vAiAWYwp/?mibextid=wwXIfr" target='_blank' className="h-10 w-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <FacebookIcon size={16} />
              </a>
              <a href="http://www.youtube.com/@phila_maison_de_temoignages" target="_blank" className="h-10 w-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <YoutubeIcon size={16} />
              </a>
              <a href="https://www.instagram.com/phila_maison_de_temoignages?igsh=aWU5Z3hiMGpydjJv" target="_blank" className="h-10 w-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <InstagramIcon size={16} />
              </a>
              <a href="https://www.tiktok.com/@philamdt" target="_blank" className="h-10 w-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-white">
                <TikTokIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: L'Église */}
          <div className="lg:pl-8">
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 pb-4 border-b border-white/5">L'Église</h3>
            <ul className="space-y-4">
              <li><Link href="/a-propos" className="text-[#968e89] text-sm hover:text-white transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link href="/media" className="text-[#968e89] text-sm hover:text-white transition-colors">Médias</Link></li>
              <li><Link href="/ministries" className="text-[#968e89] text-sm hover:text-white transition-colors">Ministères</Link></li>
              <li><Link href="/evenements" className="text-[#968e89] text-sm hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/agenda" className="text-[#968e89] text-sm hover:text-white transition-colors">Agenda</Link></li>
              <li><Link href="/acadis" className="text-[#968e89] text-sm hover:text-white transition-colors">Acadis</Link></li>
              <li><Link href="/contact" className="text-[#968e89] text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Ressources */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Ressources</h3>
            <ul className="space-y-4">
              <li><Link href="/media" className="text-[#968e89] text-sm hover:text-white transition-colors">Derniers Messages</Link></li>
              <li><Link href="/ministries" className="text-[#968e89] text-sm hover:text-white transition-colors">Ministères</Link></li>
              <li><Link href="/media" className="text-[#968e89] text-sm hover:text-white transition-colors">Vie de la communauté</Link></li>
              <li><Link href="/donation" className="text-[#968e89] text-sm hover:text-white transition-colors">Faire un don</Link></li>
              <li><Link href="/rendez-vous" className="text-[#968e89] text-sm hover:text-white transition-colors">Rendez-vous Pastoral</Link></li>
              <li><Link href="/intercession-priere" className="text-[#968e89] text-sm hover:text-white transition-colors">Besoin de Prière</Link></li>
              <li><Link href="/a-propos/#faq" className="text-[#968e89] text-sm hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 pb-4 border-b border-white/5">Contact</h3>
            <ul className="space-y-5 text-[#968e89] text-sm">
              <li className="flex gap-4 items-start">
                <MapPin size={18} className="text-accent-orange flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Avenue Zoao n°25, Q/Matonge,<br/>C/Kalamu, Kinshasa RDC</span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone size={18} className="text-accent-orange flex-shrink-0" />
                <span>+243 830 200 083</span>
              </li>
              <li className="flex gap-4 items-center">
                <Mail size={18} className="text-accent-orange flex-shrink-0" />
                <span>contact@philamdt.church</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-center gap-4 text-[#968e89] text-sm">
          <p>© {new Date().getFullYear()} Église Phila - Maison de Témoignages. Tous droits réservés.</p>
          {/* <div className="hidden md:block text-white/20"></div> */}
          {/* <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
