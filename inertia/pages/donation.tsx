import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Globe, Check, Copy, Heart, ShieldCheck } from 'lucide-react';

const Donation: React.FC = () => {
  const [amount, setAmount] = useState<string>('50');
  const [currency, setCurrency] = useState<'USD' | 'CDF' | 'EUR'>('USD');
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const westernUnion = { id: 'wu1', name: 'Western Union / MoneyGram', beneficiary: 'PHILA MDT', phone: '+243000000000', city: 'Kinshasa', country: 'RDC' };
  const equity = { id: 'eq1', name: 'EQUITY BCDC', accountName: 'PHILA MDT', accountNumber: '0000 0000 0000 0000', swift: 'EQBCDCXXXX' };

  return (
    <div className="bg-background-off min-h-screen animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <section className="bg-primary text-white pt-32 pb-24 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest mb-4">
            <Heart size={14} className="text-primary-light" />
            Soutenir l'œuvre
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-serif leading-tight">Bénir l'Église</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mx-auto">
            Votre générosité permet de financer nos missions, l'entretien de la maison de Dieu et l'aide sociale.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-16 md:mt-24">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Formulaire de Don */}
          <div className="lg:col-span-7 bg-white rounded-[40px] shadow-2xl p-8 md:p-12 border border-slate-100">
            <div className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-2xl font-black font-serif text-slate-900">1. Choisissez un montant</h3>
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
                <h3 className="text-2xl font-black font-serif text-slate-900">2. Mode de paiement</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <PaymentOption onClick={() => setSelectedMethod('mobile')} active={selectedMethod === 'mobile'} icon={<Smartphone size={24} />} title="Mobile Money" desc="M-Pesa, Orange, Airtel" />
                  <PaymentOption onClick={() => setSelectedMethod('card')} active={selectedMethod === 'card'} icon={<CreditCard size={24} />} title="Carte de Crédit" desc="Visa, Mastercard" />
                  <PaymentOption onClick={() => setSelectedMethod('paypal')} active={selectedMethod === 'paypal'} icon={<Globe size={24} />} title="PayPal" desc="Paiement en ligne" />
                  <PaymentOption onClick={() => setSelectedMethod('wu')} active={selectedMethod === 'wu'} icon={<Globe size={24} />} title="Western Union" desc="Transfert international" />
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <button className="w-full h-20 bg-primary text-white rounded-[24px] font-black text-xl shadow-2xl shadow-primary/30 hover:bg-primary-light hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4">
                  Confirmer le don de {amount} {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'FC'}
                  <Check size={28} />
                </button>
                <div className="mt-6 flex items-center justify-center gap-3 text-slate-400 text-sm font-bold">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  Paiement 100% sécurisé et crypté
                </div>
              </div>
            </div>
          </div>

          {/* Infos Bancaires (remplacé par Transfert) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h3 className="text-3xl font-black font-serif text-slate-900">Informations de Transfert</h3>
              <p className="text-slate-500 font-medium">Retrouvez ci-dessous les détails pour votre paiement par Western Union.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 bg-primary/5 rounded-bl-3xl">
                  <Globe className="text-primary/20" size={32} />
                </div>
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">International</span>
                  <h4 className="text-xl font-black font-serif text-slate-900">{westernUnion.name}</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bénéficiaire</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                      <span className="font-bold text-slate-700">{westernUnion.beneficiary}</span>
                      <button 
                        onClick={() => handleCopy(westernUnion.beneficiary, westernUnion.id)}
                        className={`p-2 rounded-lg transition-all ${copied === westernUnion.id ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}
                      >
                        {copied === westernUnion.id ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ville</p>
                      <p className="font-bold text-slate-700">{westernUnion.city}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pays</p>
                      <p className="font-bold text-slate-700">{westernUnion.country}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Téléphone</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                      <span className="font-bold text-slate-700 font-mono tracking-wider break-all">{westernUnion.phone}</span>
                      <button 
                        onClick={() => handleCopy(westernUnion.phone, westernUnion.id + 'phone')}
                        className={`p-2 rounded-lg transition-all ${copied === westernUnion.id + 'phone' ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}
                      >
                        {copied === westernUnion.id + 'phone' ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* EQUITY BCDC */}
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 bg-primary/5 rounded-bl-3xl">
                  <Banknote className="text-primary/20" size={32} />
                </div>
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Banque</span>
                  <h4 className="text-xl font-black font-serif text-slate-900">{equity.name}</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Titulaire</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                      <span className="font-bold text-slate-700">{equity.accountName}</span>
                      <button 
                        onClick={() => handleCopy(equity.accountName, equity.id + 'name')}
                        className={`p-2 rounded-lg transition-all ${copied === equity.id + 'name' ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}
                      >
                        {copied === equity.id + 'name' ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Numéro de Compte</p>
                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-primary/20 transition-all">
                      <span className="font-black text-slate-900 font-mono tracking-wider break-all">{equity.accountNumber}</span>
                      <button 
                        onClick={() => handleCopy(equity.accountNumber, equity.id)}
                        className={`p-2 rounded-lg transition-all ${copied === equity.id ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:bg-primary hover:text-white shadow-sm'}`}
                      >
                        {copied === equity.id ? <Check size={16}/> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10">
              <p className="text-primary font-bold text-sm italic leading-relaxed">
                "Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie."
                <br /><span className="not-italic block mt-2 text-[10px] uppercase tracking-widest opacity-60">— 2 Corinthiens 9:7</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ icon, title, desc, active, onClick }: any) => (
  <button onClick={onClick} className={`p-6 rounded-3xl border-2 text-left transition-all active:scale-95 flex flex-col gap-4 w-full ${active ? 'border-primary bg-primary/5 shadow-lg' : 'border-slate-100 bg-white hover:border-primary/20'}`}>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-primary'}`}>
      {icon}
    </div>
    <div className="space-y-1">
      <p className="font-black text-slate-900">{title}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{desc}</p>
    </div>
  </button>
);

export default Donation;
