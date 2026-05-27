import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

interface Ministry {
  id: number
  name: string
  slug: string | null
  tag: string | null
  desc: string | null
  content: string | null
  img: string | null
  color: string | null
}

interface Props {
  ministries: Ministry[]
}

const Activities: React.FC<Props> = ({ ministries = [] }) => {
  return (
    <div className="bg-white min-h-screen animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Hero Banner */}
      <section className="relative h-[450px] flex items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://lh3.googleusercontent.com/aida-public/AB6AXuDQJAp4d1FS3guwSJ81zpCGdDVOnC806zIuiaPezR0GsiQLLHqjCjQylY0peyAIDO1vYOGfzzOoe5U_NO2QTh1MbPzgG8WReUrFVFZyz3SoGe9Imc-ZxldUt0ETVRSJoHwh9m6Nf7-42_ptuohfHOugTWnn52ySVXrXFh1P5jauJJnts1ZzuCVvZ0K8Dmy_GE-XsGros5uvvS3Ies7EUkeGTxGVMJnz--2NoeH6w8Qm0aVx6AIpquwaWaCwYoqQbFVpb76PbZRr"
            className="w-full h-full object-cover"
          >
            <source src="/MARDI MALAKISI _ La connaissance qui libère.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#7a3218]/35 to-[#5b2010]/75" />
        </div>
        <div className="relative z-10 space-y-4 max-w-2xl">
          <h1 className="text-white text-4xl md:text-6xl font-black font-serif leading-tight">Nos Ministères</h1>
          <p className="text-white/90 text-lg md:text-xl font-medium">Rejoignez-nous pour grandir ensemble dans la foi et vivre la communion fraternelle.</p>
        </div>
      </section>

      {/* Ministries */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-2">
              <h2 className="text-slate-900 text-3xl font-bold font-serif">Ministères & Activités</h2>
              <p className="text-slate-500">Il y a une place pour chacun à la MDT.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ministries.map((min, idx) => (
              <div key={min.id ?? idx} className="group flex flex-col rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="relative h-48 overflow-hidden">
                  {min.img ? (
                    <img src={min.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={min.name} />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-white text-4xl font-black ${min.color || 'bg-slate-400'}`}>
                      {min.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {min.tag && (
                    <span className={`absolute bottom-4 left-4 ${min.color || 'bg-slate-500'} text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest`}>{min.tag}</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold font-serif mb-2 group-hover:text-primary transition-colors">{min.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6">{min.desc || 'Aucune description disponible.'}</p>
                  {min.slug && (
                    <Link href={`/ministeres/${min.slug}`} className="mt-auto flex items-center gap-2 text-primary text-sm font-bold hover:gap-4 transition-all">
                      En savoir plus
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Activities;
