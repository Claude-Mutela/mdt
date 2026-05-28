
import React, { useState, useMemo } from 'react';
import { Search, Video, Image as ImageIcon, Music, FileText, Filter, ChevronRight } from 'lucide-react';
import { MediaItem, MediaType } from '../../types';

// Move MediaGridCard above AllContent and use React.FC to fix type error with key prop.
const MediaGridCard: React.FC<{ item: MediaItem }> = ({ item }) => {
  const getBadgeColor = () => {
    switch(item.type) {
      case 'video': return 'bg-red-500';
      case 'audio': return 'bg-blue-500';
      case 'image': return 'bg-emerald-500';
      case 'document': return 'bg-amber-500';
      default: return 'bg-slate-500';
    }
  };

  const getActionLabel = () => {
    switch(item.type) {
      case 'video': return 'Regarder';
      case 'audio': return 'Écouter';
      case 'image': return 'Voir';
      case 'document': return 'Lire';
      default: return 'Ouvrir';
    }
  };

  return (
    <article className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img src={item.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
        <div className={`absolute top-4 left-4 ${getBadgeColor()} text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg`}>
          {item.type}
        </div>
        {item.duration && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
            {item.duration}
          </div>
        )}
      </div>
      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <span className="text-primary font-bold text-[10px] uppercase tracking-widest">{item.category}</span>
          <span className="text-slate-400 text-xs font-medium">{item.date}</span>
        </div>
        <h3 className="text-xl font-bold font-serif text-slate-900 mb-6 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">{item.size || 'Média HD'}</span>
          <button className="flex items-center gap-2 text-sm font-black text-primary hover:gap-4 transition-all uppercase tracking-tighter">
            {getActionLabel()}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

const AllContent: React.FC<{ items?: MediaItem[] }> = ({ items = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<MediaType | 'all'>('all');

  const filteredData = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter]);

  const filters: { id: MediaType | 'all', label: string, icon: any }[] = [
    { id: 'all', label: 'Tous', icon: Filter },
    { id: 'video', label: 'Vidéos', icon: Video },
    { id: 'image', label: 'Images', icon: ImageIcon },
    { id: 'audio', label: 'Audios', icon: Music },
    { id: 'document', label: 'Documents', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background-off animate-in fade-in duration-500">
      <section className="bg-white border-b border-[#EAE5DF] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black font-serif text-slate-900 leading-tight">Médiathèque Complète</h1>
              <p className="text-slate-500 text-lg max-w-xl">Explorez l'ensemble de nos ressources spirituelles classées par catégorie.</p>
            </div>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher par titre..."
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-12 overflow-x-auto pb-2 no-scrollbar">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap shadow-sm active:scale-95 ${
                  activeFilter === filter.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:border-primary/50'
                }`}
              >
                <filter.icon size={18} />
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredData.map(item => (
              <MediaGridCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold font-serif text-slate-900">Aucun résultat trouvé</h3>
            <p className="text-slate-500 max-w-xs">Essayez d'ajuster vos filtres ou de modifier votre recherche.</p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveFilter('all');}}
              className="text-primary font-bold hover:underline"
            >
              Réinitialiser tout
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AllContent;
