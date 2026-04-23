
import React, { useState, useEffect } from 'react';
import { Maximize2, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const mockGallery = Array.from({ length: 42 }).map((_, i) => ({
  id: `${i}`,
  url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?auto=format&fit=crop&q=80&w=1200`,
  title: `Moment Spirituel #${i + 1}`,
  date: 'Printemps 2024'
}));

const ITEMS_PER_PAGE = {
  mobile: 12,
  desktop: 24
};

const Gallery: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE.desktop);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1024 ? ITEMS_PER_PAGE.mobile : ITEMS_PER_PAGE.desktop);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(mockGallery.length / itemsPerPage);
  const paginatedItems = mockGallery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextSlide = () => setSelectedIdx(prev => (prev !== null && prev < paginatedItems.length - 1) ? prev + 1 : prev);
  const prevSlide = () => setSelectedIdx(prev => (prev !== null && prev > 0) ? prev - 1 : prev);

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-700">
      {/* Hero */}
      <section className="bg-primary text-white py-24 text-center px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-black font-serif">Galerie Photos</h1>
          <p className="text-primary-light/30 h-1 w-24 bg-white/20 mx-auto rounded-full"></p>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed">
            Parcourez les témoignages visuels de la vie de notre église à travers nos événements et cultes.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-[1920px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
          {paginatedItems.map((img, idx) => (
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

        {/* Pagination */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100 pt-10">
          <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">
            Page {currentPage} sur {totalPages}
          </p>
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white hover:border-primary/20 hover:shadow-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${
                    currentPage === i + 1 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-primary/50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white hover:border-primary/20 hover:shadow-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedIdx !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col p-4 md:p-10 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div className="text-white">
              <h4 className="text-xl font-bold font-serif">{paginatedItems[selectedIdx].title}</h4>
              <p className="text-xs text-white/50 tracking-widest uppercase">{paginatedItems[selectedIdx].date}</p>
            </div>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                <Download size={20} />
              </button>
              <button 
                onClick={() => setSelectedIdx(null)}
                className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-xl hover:bg-primary-light"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="relative flex-1 flex items-center justify-center">
            <button 
              onClick={(e) => {e.stopPropagation(); prevSlide();}}
              className="absolute left-0 md:left-4 z-10 w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={32} />
            </button>
            <img 
              src={paginatedItems[selectedIdx].url} 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500" 
              alt="Fullscreen" 
            />
            <button 
              onClick={(e) => {e.stopPropagation(); nextSlide();}}
              className="absolute right-0 md:right-4 z-10 w-16 h-16 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={32} />
            </button>
          </div>
          
          <p className="text-white/40 text-center mt-6 text-sm">
            {selectedIdx + 1} / {paginatedItems.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
