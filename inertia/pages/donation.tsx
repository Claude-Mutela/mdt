import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { CreditCard, Smartphone, Banknote, Globe, Check, Copy, Heart, ShieldCheck, Gift, ChevronDown } from 'lucide-react';

const Donation: React.FC = () => {
  const [amount, setAmount] = useState<string>('50');
  const [currency, setCurrency] = useState<'USD' | 'CDF' | 'EUR'>('USD');
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [copied, setCopied] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const westernUnion = { id: 'wu1', name: 'Western Union / MoneyGram', beneficiary: 'PHILA MDT', phone: '+243000000000', city: 'Kinshasa', country: 'RDC' };
  const equity = { id: 'eq1', name: 'EQUITY BCDC', accountName: 'PHILA MDT', accountNumber: '00011 050 233 2000 6931 7219', swift: 'EQBCDCXXXX' };

  const faqs = [
    {
      q: "Quelles sont les différentes façons de donner ?",
      a: "Trois options s'offrent à vous :\n- En ligne, via notre plateforme de paiement sécurisée (Mobile Money et Carte de Crédit).\n- Par virement bancaire ou transfert international (Equity BCDC, Western Union).\n- En nature, en offrant du matériel, des vivres ou tout autre bien utile à la mission."
    },
    {
      q: "Puis-je faire un virement depuis une autre banque ou un autre pays ?",
      a: "Oui. Nos comptes bancaires acceptent les virements locaux et internationaux. Il vous suffit d'utiliser les coordonnées affichées sur la page et d'indiquer clairement le motif de votre offrande. Notre équipe confirmera la réception dès validation."
    },
    {
      q: "Comment offrir en nature ?",
      a: "Veuillez contacter le secrétariat de l'église. Décrivez votre offrande (vivres, équipements, matériel, etc.) et nous organiserons la réception au temple."
    },
    {
      q: "Que faire si je rencontre des difficultés pour donner ?",
      a: "Si vous rencontrez un problème technique ou une erreur de paiement, n'hésitez pas à nous contacter via nos numéros officiels ou notre adresse e-mail. Notre équipe vous assistera rapidement."
    }
  ];

  return (
    <>
      <Head title="Donation - Phila Maison de Témoignages">
        <meta name="description" content="Soutenez l'œuvre de Dieu et les actions sociales de la Phila Maison de Témoignages en faisant un don en ligne sécurisé." />
      </Head>
      <div className="bg-background-off min-h-screen animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
        
        {/* Hero Section */}
        <section className="bg-primary text-white pt-24 pb-20 text-center px-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest mb-2">
              <Heart size={14} className="text-white" />
              Soutenir l'œuvre
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-serif leading-tight">Votre générosité change des vies</h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              À PHILA MDT, chaque offrande est une semence d'impact. Grâce à vous, des âmes entendent l'Évangile, des vies sont restaurées, et l'Église grandit.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-16 space-y-24">
          
          {/* Quick Links / 3 Options Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <a href="#en-ligne" className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Paiement en ligne</h3>
              <p className="text-slate-500 text-sm">Donnez facilement depuis votre téléphone ou ordinateur, en toute sécurité.</p>
              <span className="text-primary font-bold text-sm mt-2">En savoir plus →</span>
            </a>
            
            <a href="#bancaire" className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Banknote size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Virement bancaire</h3>
              <p className="text-slate-500 text-sm">Transférez votre don vers nos comptes officiels et recevez un reçu.</p>
              <span className="text-primary font-bold text-sm mt-2">Voir nos coordonnées →</span>
            </a>

            <a href="#nature" className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all text-center space-y-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Gift size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">Don en nature</h3>
              <p className="text-slate-500 text-sm">Offrez des vivres, du matériel ou tout autre bien utile à la mission.</p>
              <span className="text-primary font-bold text-sm mt-2">Donner en nature →</span>
            </a>
          </div>

          <hr className="border-slate-100" />

          {/* Section 1: Paiement en Ligne */}
          <section id="en-ligne" className="scroll-mt-24">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-serif text-slate-900">Paiement en Ligne</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Sélectionnez le montant et votre méthode de paiement préférée. La transaction est entièrement sécurisée.</p>
            </div>
            
            <div className="max-w-3xl mx-auto bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-slate-100">
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold font-serif text-slate-900">1. Choisissez un montant</h3>
                  <div className="flex gap-4">
                    <div className="relative group flex-1">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 group-focus-within:text-primary transition-colors">
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'FC'}
                      </span>
                      <input
                        type="number"
                        placeholder="Montant..."
                        className="w-full h-16 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none font-black text-xl transition-all"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="h-16 px-4 md:px-6 rounded-2xl bg-slate-50 border border-slate-200 focus:border-primary outline-none font-black text-lg transition-all cursor-pointer w-28 md:w-32"
                    >
                      <option value="USD">USD</option>
                      <option value="CDF">CDF</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold font-serif text-slate-900">2. Mode de paiement</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <PaymentOption onClick={() => setSelectedMethod('mobile')} active={selectedMethod === 'mobile'} icon={<Smartphone size={24} />} title="Mobile Money" desc="M-Pesa, Orange, Airtel" />
                    <PaymentOption onClick={() => setSelectedMethod('card')} active={selectedMethod === 'card'} icon={<CreditCard size={24} />} title="Carte de Crédit" desc="Visa, Mastercard" />
                    <PaymentOption onClick={() => setSelectedMethod('paypal')} active={selectedMethod === 'paypal'} icon={<Globe size={24} />} title="PayPal" desc="Paiement en ligne" />
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <button className="w-full h-16 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:bg-primary-light hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3">
                    Confirmer le don de {amount} {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'FC'}
                    <Check size={24} />
                  </button>
                  <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Paiement 100% sécurisé et crypté
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Virement Bancaire */}
          <section id="bancaire" className="scroll-mt-24 pt-12">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-serif text-slate-900">Nos Coordonnées Bancaires</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Effectuez un virement bancaire ou un transfert international en utilisant les informations ci-dessous.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* EQUITY BCDC */}
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 bg-primary/5 rounded-bl-[40px]">
                  <Banknote className="text-primary/30" size={40} />
                </div>
                <div className="space-y-2 mb-8">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Banque Locale</span>
                  <h4 className="text-2xl font-black font-serif text-slate-900">{equity.name}</h4>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Intitulé du compte</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700">{equity.accountName}</span>
                      <button onClick={() => handleCopy(equity.accountName, equity.id + 'name')} className={`p-2 rounded-lg transition-all ${copied === equity.id + 'name' ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}>
                        {copied === equity.id + 'name' ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Numéro de Compte (USD)</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-black text-slate-900 font-mono tracking-wider break-all">{equity.accountNumber}</span>
                      <button onClick={() => handleCopy(equity.accountNumber, equity.id)} className={`p-2 rounded-lg transition-all ${copied === equity.id ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}>
                        {copied === equity.id ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Western Union */}
              <div className="bg-white p-8 md:p-10 rounded-[32px] border border-slate-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 bg-primary/5 rounded-bl-[40px]">
                  <Globe className="text-primary/30" size={40} />
                </div>
                <div className="space-y-2 mb-8">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Transfert International</span>
                  <h4 className="text-2xl font-black font-serif text-slate-900">{westernUnion.name}</h4>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bénéficiaire</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-700">{westernUnion.beneficiary}</span>
                      <button onClick={() => handleCopy(westernUnion.beneficiary, westernUnion.id)} className={`p-2 rounded-lg transition-all ${copied === westernUnion.id ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}>
                        {copied === westernUnion.id ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ville / Pays</p>
                      <p className="font-bold text-slate-700 p-4 rounded-xl bg-slate-50 border border-slate-100">{westernUnion.city}, {westernUnion.country}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                      <div className="flex items-center justify-between gap-2 p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-bold text-slate-700 font-mono tracking-wider truncate">{westernUnion.phone}</span>
                        <button onClick={() => handleCopy(westernUnion.phone, westernUnion.id + 'phone')} className={`p-2 rounded-lg transition-all flex-shrink-0 ${copied === westernUnion.id + 'phone' ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}>
                          {copied === westernUnion.id + 'phone' ? <Check size={16}/> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Don en Nature */}
          <section id="nature" className="scroll-mt-24 pt-12">
            <div className="bg-primary text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Gift size={32} className="text-white" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black font-serif leading-tight">Votre donation en nature</h2>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Vos offrandes en nature, qu'il s'agisse de vivres, de produits agricoles, d'équipements, d'instruments ou de matériel de service, participent directement à l'œuvre de Dieu.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Chaque offrande est reçue avec reconnaissance, utilisée avec sagesse et gérée avec transparence.
                  </p>
                  <div className="pt-4">
                    <a href="/contact" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-slate-50 transition-colors shadow-lg">
                      Nous contacter pour un dépôt
                    </a>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="/hospitalite-mdt.jpeg" 
                    alt="Don en nature" 
                    className="w-full aspect-square object-cover rounded-3xl shadow-2xl rotate-3"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="pt-12 max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-serif text-slate-900">Foire aux questions</h2>
              <p className="text-slate-500">Tout ce que vous devez savoir sur le processus de donation.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`border rounded-2xl overflow-hidden transition-colors ${activeFaq === index ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:border-primary/30'}`}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none"
                  >
                    <span className="font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${activeFaq === index ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Verse */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center max-w-2xl mx-auto">
            <p className="text-slate-600 font-serif text-xl italic leading-relaxed">
              "Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie."
            </p>
            <span className="block mt-4 text-xs font-bold uppercase tracking-widest text-primary">— 2 Corinthiens 9:7</span>
          </div>

        </div>
      </div>
    </>
  );
};

const PaymentOption = ({ icon, title, desc, active, onClick }: any) => (
  <button onClick={onClick} className={`p-6 rounded-2xl border-2 text-left transition-all active:scale-95 flex items-center gap-4 w-full ${active ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-white hover:border-primary/20'}`}>
    <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary'}`}>
      {icon}
    </div>
    <div className="space-y-1">
      <p className="font-bold text-slate-900 leading-tight">{title}</p>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{desc}</p>
    </div>
  </button>
);

export default Donation;
