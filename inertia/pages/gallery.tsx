
import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { Images, ChevronRight } from 'lucide-react';

interface Album {
  id: number
  title: string
  slug: string
  coverImg: string | null
  imgNber: number
}

const Gallery: React.FC<{ albums?: Album[] }> = ({ albums = [] }) => {
  return (
    <>
      <Head title="Galerie Photos — Phila MDT">
        <meta name="description" content="Parcourez les témoignages visuels de la vie de notre église à travers nos albums photos." />
      </Head>
      <div className="min-h-screen bg-white animate-in fade-in duration-700">
      {/* Hero */}
      <section className="bg-primary text-white py-24 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-black font-serif">Galerie Photos</h1>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Parcourez les témoignages visuels de la vie de notre église à travers nos albums.
          </p>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
              <Images size={40} />
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900">Aucun album disponible</h3>
            <p className="text-slate-500">Les albums seront ajoutés prochainement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="group block rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Cover */}
                <div className="relative aspect-square overflow-hidden bg-slate-200">
                  {album.coverImg ? (
                    <img
                      src={album.coverImg}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Images size={48} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {album.imgNber > 0 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                      {album.imgNber} photo{album.imgNber > 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex items-center justify-between">
                  <h3 className="text-slate-900 font-bold font-serif text-lg leading-tight group-hover:text-primary transition-colors">
                    {album.title}
                  </h3>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
};

export default Gallery;
