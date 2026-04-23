
import React from 'react';
import { MapPin, Phone, Clock, Send, ExternalLink } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-background-off min-h-screen animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-slate-900 text-4xl md:text-6xl font-black font-serif">Contactez-nous</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Nous sommes là pour vous. Que ce soit pour une demande d'information, un témoignage ou un sujet de prière, n'hésitez pas à nous écrire.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold font-serif mb-8">Envoyez-nous un message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Nom complet</label>
                    <input type="text" placeholder="Votre nom" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-slate-50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Adresse Email</label>
                    <input type="email" placeholder="nom@exemple.com" className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-slate-50 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Objet</label>
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-slate-50 outline-none appearance-none">
                    <option>Demande d'information</option>
                    <option>Sujet de prière</option>
                    <option>Témoignage</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <textarea placeholder="Comment pouvons-nous vous aider ?" className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-slate-50 outline-none resize-none"></textarea>
                </div>
                <button className="w-full md:w-auto h-14 px-10 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-light transition-all active:scale-95 flex items-center justify-center gap-2">
                  Envoyer
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-2xl font-bold font-serif">Nos Coordonnées</h3>
            
            <DetailItem icon={<MapPin size={24} />} title="Adresse" desc="Zoao N°25, Q/ Matonge 1, Blvd Sendwe / Entrée hôtel Sendwe, Kinshasa-RD Congo. BP: 6270" />
            <DetailItem 
              icon={<Phone size={24} />} 
              title="Contact Direct" 
              desc="+243 9 999 51 032" 
              sub="contact@phila-mdt.org"
            />
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <Clock size={24} />
                <h4 className="font-bold font-serif text-lg">Horaires des cultes</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex justify-between text-sm pb-2 border-b border-slate-50">
                  <span className="font-medium text-slate-500">Dimanche:</span>
                  <span className="font-bold text-slate-900">8h00 - Culte Dominical</span>
                </li>
                <li className="flex justify-between text-sm pb-2 border-b border-slate-50">
                  <span className="font-medium text-slate-500">Mardi:</span>
                  <span className="font-bold text-slate-900">17h30 - Enseignement</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">Jeudi:</span>
                  <span className="font-bold text-slate-900">17h30 - Intercession</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold font-serif mb-8">Nous trouver</h3>
          <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-slate-100">
            <iframe 
              src="https://maps.google.com/maps?q=Phila%20Maison%20de%20Temoignages,%20Kinshasa&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full border-0" 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Phila Maison de Témoignages"
            ></iframe>
            <a 
              href="https://maps.google.com/maps?q=Phila+Maison+de+Temoignages,+Kinshasa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="absolute bottom-6 left-4 md:bottom-10 md:left-10 bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-2xl max-w-xs md:max-w-sm border border-slate-100 flex items-center gap-4 md:gap-6 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-xl animate-bounce shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-black text-lg md:text-xl font-serif text-slate-900 leading-tight">Eglise Phila MDT</p>
                <p className="text-xs md:text-sm font-medium text-primary mt-0.5">Ouvrir dans Google Maps</p>
              </div>
              <ExternalLink size={18} className="text-slate-300 ml-auto shrink-0 hidden md:block" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, title, desc, sub }: any) => (
  <div className="flex items-start gap-6 p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
      {icon}
    </div>
    <div className="space-y-1">
      <h4 className="font-bold font-serif text-lg">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
      {sub && <p className="text-primary font-bold text-sm hover:underline cursor-pointer pt-1">{sub}</p>}
    </div>
  </div>
);

export default Contact;
