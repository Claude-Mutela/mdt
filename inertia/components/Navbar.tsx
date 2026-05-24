import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'À Propos', path: '/a-propos' },
    { name: 'Médias', path: '/media' },
    { name: 'Ministères', path: '/ministries' },
    { name: 'Events', path: '/evenements' },
    { name: 'Acadis', path: '/acadis' },
    { name: 'Rendez-vous', path: '/rendez-vous' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => url === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#EAE5DF]">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full shadow-sm border border-primary/10">
              <img
                alt="Logo Phila"
                className="h-full w-full object-cover"
                src="/log-phila-mdt.png"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-primary leading-tight font-serif">PHILA MDT</h2>
              <span className="text-[10px] font-bold text-accent-orange uppercase tracking-widest hidden sm:block">Maison de Témoignages</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-6">
            <div className="flex items-center gap-4 xl:gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-semibold transition-colors ${isActive(link.path)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-slate-600 hover:text-primary'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <Link
              href="/intercession-priere"
              className="bg-white border-2 border-primary text-primary text-sm font-bold h-10 px-5 rounded-lg transition-all hover:bg-primary/5 active:scale-95 flex items-center justify-center"
            >
              Besoin de Prière
            </Link>
            <Link
              href="/donation"
              className="bg-primary hover:bg-primary-light text-white text-sm font-bold h-10 px-6 rounded-lg transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              Faire un don
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="xl:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="xl:hidden bg-white border-b border-[#EAE5DF] px-4 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-bold ${isActive(link.path) ? 'text-primary' : 'text-slate-600'
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/intercession-priere"
            onClick={() => setIsOpen(false)}
            className="w-full bg-white border-2 border-primary text-primary font-bold h-12 rounded-lg mt-2 flex items-center justify-center"
          >
            Besoin de Prière
          </Link>
          <Link
            href="/donation"
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary text-white font-bold h-12 rounded-lg mt-2 flex items-center justify-center"
          >
            Faire un don
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
