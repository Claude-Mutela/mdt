
import React, { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { PlayCircle, ExternalLink } from 'lucide-react';

interface Video {
  id: string
  title: string
  category: string
  date: string
  duration: string
  speaker: string | null
  thumbnail: string
  url: string
}

interface GalleryImage {
  id: string
  url: string
  title: string
  date: string
}

function isYoutubeUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const watchMatch = url.match(/[?&]v=([^&#]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/);
  if (watchMatch) return watchMatch[1];
  if (shortMatch) return shortMatch[1];
  return null;
}

function getYoutubeEmbedUrl(url: string): string {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
}

function getYoutubeThumbnailUrl(url: string): string {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function getVideoPlayUrl(thumbnail: string, url: string): string {
  if (isYoutubeUrl(thumbnail)) return thumbnail;
  return url;
}

function getThumbnail(thumbnail: string, url: string): string {
  if (isYoutubeUrl(thumbnail)) {
    return getYoutubeThumbnailUrl(thumbnail);
  }
  if (thumbnail && thumbnail.trim() !== '' && !isYoutubeUrl(thumbnail)) {
    return thumbnail;
  }
  if (isYoutubeUrl(url)) {
    return getYoutubeThumbnailUrl(url);
  }
  return '/mdt-banner.jpg';
}

const Media: React.FC<{ videos?: Video[]; galleryImages?: GalleryImage[] }> = ({ videos = [], galleryImages = [] }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <>
      <Head title="Médias — Phila MDT">
        <meta name="description" content="Découvrez nos enseignements en vidéo, podcasts audio et reportages photo pour nourrir votre vie spirituelle." />
      </Head>
      <div className="bg-background-off min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="bg-white pt-20 pb-12 border-b border-[#EAE5DF]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-primary font-bold text-sm tracking-wider uppercase">Médiathèque</span>
            </div>
            <h1 className="text-slate-900 text-4xl md:text-6xl font-black leading-tight font-serif">
              Ressources & Inspirations
            </h1>
            <p className="text-slate-500 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mt-2">
              Revivez nos cultes, écoutez nos enseignements et découvrez la vie de l'église en images.
            </p>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-slate-900 text-3xl font-bold font-serif">Dernières Vidéos</h2>
              <p className="text-slate-500 mt-1">Cultes et moments de louange</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline">
              Voir toute la chaîne
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((vid, idx) => (
              <VideoCard 
                key={idx} 
                {...vid} 
                onPlay={() => setActiveVideo(getVideoPlayUrl(vid.thumbnail, vid.url))} 
              />
            ))}
          </div>
          <div className="flex justify-center mt-12 gap-4">
            <Link href="/allContent" className="flex items-center gap-3 bg-white border-2 border-primary/20 text-primary font-bold px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-all shadow-md">
              <PlayCircle />
              Accéder à tous nos contenus
            </Link>
            <Link href="/gallery" className="flex items-center gap-3 bg-primary text-white font-bold px-8 py-4 rounded-xl hover:bg-primary-light transition-all shadow-md">
              Explorer la Galerie
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-20 bg-white border-t border-[#EAE5DF]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="flex justify-between items-end">
            <div className="text-left space-y-3">
              <span className="text-primary font-bold text-sm tracking-wider uppercase">Aperçu Galerie</span>
              <h2 className="text-slate-900 text-3xl font-bold font-serif">Vie de la Communauté</h2>
            </div>
            <Link href="/gallery" className="text-primary font-bold hover:underline flex items-center gap-2">
              Tout voir <ExternalLink size={16}/>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {galleryImages.length > 0
              ? galleryImages.map((img) => (
                  <GalleryThumb key={img.id} src={img.url} title={img.title} />
                ))
              : (
                <p className="col-span-3 text-center text-slate-400 py-12">Aucune image disponible pour le moment.</p>
              )
            }
          </div>
        </div>
      </section>

      {/* Video Lightbox Modal */}
      {activeVideo && (
        <div 
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video cursor-default"
          >
            {isYoutubeUrl(activeVideo) && (
              <div className="absolute top-4 left-4 z-50">
                <a 
                  href={activeVideo} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 bg-black/60 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 transition-colors shadow-lg"
                >
                  <span>Ouvrir sur YouTube</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}

            <button 
              onClick={() => setActiveVideo(null)} 
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full z-50 transition-colors border border-white/10"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            {isYoutubeUrl(activeVideo) ? (
              <iframe
                className="w-full h-full"
                src={`${getYoutubeEmbedUrl(activeVideo)}?autoplay=1`}
                title="Lecture vidéo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video
                controls
                autoPlay
                className="w-full h-full object-cover"
              >
                <source src={activeVideo} />
                Votre navigateur ne supporte pas la lecture de cette vidéo.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const VideoCard = ({ thumbnail, duration, title, category, date, speaker, url, onPlay }: any) => {
  const displayThumbnail = getThumbnail(thumbnail, url);
  return (
    <article onClick={onPlay} className="group cursor-pointer space-y-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
        <img src={displayThumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="bg-primary/90 text-white p-5 rounded-full shadow-2xl transform group-hover:scale-110 transition-all border border-white/20">
            <PlayCircle size={40} />
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg backdrop-blur-md">
          {duration}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-primary font-black uppercase tracking-widest text-[10px]">{category}</span>
          <span className="text-slate-400 text-xs">{date}</span>
        </div>
        <h3 className="text-slate-900 text-xl font-bold font-serif leading-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-slate-500 text-sm font-medium">{speaker}</p>
      </div>
    </article>
  );
};

const GalleryThumb = ({ src, title }: { src: string, title: string }) => (
  <div className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer">
    <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={title} />
    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-6">
      <p className="text-white font-bold text-lg font-serif">{title}</p>
    </div>
  </div>
);

export default Media;
