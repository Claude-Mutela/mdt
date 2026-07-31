
import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { Maximize2, X, ChevronLeft, ChevronRight, ArrowLeft, Images } from 'lucide-react';

interface GalleryImage {
  id: string
  url: string
  title: string
  date: string
}

interface Album {
  id: number
  title: string
  images: GalleryImage[]
}

const GalleryContent: React.FC<{ album?: Album }> = ({ album }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Album introuvable.
      </div>
    );
  }

  const { images } = album;

  const nextSlide = () =>
    setSelectedIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
  const prevSlide = () =>
    setSelectedIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));

  return (
    <>
      <Head title={`${album.title} — Galerie — Phila MDT`}>
        <meta name="description" content={`Découvrez l'album photos "${album.title}" de la Phila Maison de Témoignages et parcourez les moments clés en images.`} />
      </Head>
      <div className="min-h-screen bg-white animate-in fade-in duration-700">
      {/* Header */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-bold mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour aux albums
          </Link>
          <h1 className="text-4xl md:text-5xl font-black font-serif">{album.title}</h1>
          <p className="text-white/70 mt-2 font-medium">
            {images.length} photo{images.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Images Grid */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-16">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
              <Images size={40} />
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900">Aucune photo dans cet album</h3>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {images.map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setSelectedIdx(idx)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0"
                  alt={img.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                    <Maximize2 size={24} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-10 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              <h4 className="text-xl font-bold font-serif">{images[selectedIdx].title}</h4>
              <p className="text-xs text-white/50 tracking-widest uppercase">{images[selectedIdx].date}</p>
            </div>
            <button
              onClick={() => setSelectedIdx(null)}
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:bg-primary-light transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              disabled={selectedIdx === 0}
              className="absolute left-0 md:left-4 z-10 w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
            <img
              src={images[selectedIdx].url}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500"
              alt="Fullscreen"
            />
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              disabled={selectedIdx === images.length - 1}
              className="absolute right-0 md:right-4 z-10 w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <p className="text-white/40 text-center mt-6 text-sm">
            {selectedIdx + 1} / {images.length}
          </p>
        </div>
      )}
    </div>
    </>
  );
};

export default GalleryContent;
