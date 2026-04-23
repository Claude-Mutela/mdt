
import React from 'react';
import { Link } from '@inertiajs/react';
import { PlayCircle, ExternalLink } from 'lucide-react';

const videos = [
  {
    title: "Culte du Dimanche - La Foi Inébranlable",
    category: "Prédication",
    date: "Il y a 2 jours",
    duration: "1:12:45",
    speaker: "Pasteur Principal",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFDsge1-zf7795RPCUHKpW8_MwiKDkH8-352xqO3kuTOo6VDYCv-q5eAmX6GsaqPAuR8P_6x0N-wH4J1CGghtRJ7xn5Nf_sFGP_RT8R0WtjPrGa0bOURDGAV4uONG8QVv1rIG1eaSdeQnidhGuYv6MosIkxqYqinDXi02MvA7JdN23Pycl9F07d4529SqiXd7wKktbO6e_QBpKy0ICQcBQDcB3SNi_Z1vt3dvrdn4CudU6h5oaOrjeylJFHu2BJ7rGshkAMvPu"
  },
  {
    title: "Soirée d'Adoration & Louange",
    category: "Louange",
    date: "Il y a 1 semaine",
    duration: "45:20",
    speaker: "Équipe Louange",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-mkH24gLY2fF9jKSBfMCGf8YDjr7EBNE3a9oMqYVurErE2CuL89bOSzDJoFlYBMJbFz8pTbP-jViOy5mJA56DMY7_J3LuuWrND7o-kkYobXPR1M8gSMgZef_rQE8w1U1EbpKr7v8zUkYLdtJ1xZgJs-WHaEnQDQXWxq5zChT57CG4THFrZQ2zOAdEm8QzC2xqMeDGleQ8mnOd2cXFiTvAnNKusHQrtzJiwjP4PyAdrSl9KmJnVlYNj_HIkdJwe6N7YeAvmqkc"
  },
  {
    title: "Étude Biblique - L'Évangile de Jean",
    category: "Enseignement",
    date: "Il y a 2 semaines",
    duration: "58:10",
    speaker: "Pasteur Jean",
    thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6OOb6ZIPTXMrNmp3U-T7XHO86wzpwyvQzGwAbHlnJuwYqzCOR4cyIwHfDx2lVTA0cwirC7ZbyLZn9fw51JzF__lluHB3qz3XNEWbtzj_Hi_-re50txTXz5dA7qgKbaZjJ0itVYbCH9gtt8lwr1r6VejfaYqPS5h1zsW8XZJJkBF4VAQQlMb7tFajPzHnHS3uSpVk_d5v83PxuYsw2Cpy8N5ZAjsrU7Pj0JafXWGN0F0fSFP9p_ENsda_TKjRo4zEXkMJvUZE"
  }
];

const Media: React.FC = () => {
  return (
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
              <VideoCard key={idx} {...vid} />
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
            <GalleryThumb src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-eeVhQDknROns1HSEdOa0AXI-ooafaMuqzOmXs_4Xa8NydHB5UnBNZSDU-PJ91Hs7gBcBM89HQRLhy9jBYA7BYVHUKk32kHEX8nu6FBuYEFgPuFj_AQa7Hw5RxagBfDYJTAcU6jngt9mRl7QhWstG5RPpIGSPC2Sn9U2k9AcIgPqIZDyWlULhhor77q1MizBXhmm9hx-u6CDG_S7TWVonQ9YEZUJpie-nvaggRij1wvIKRAqAVuOtzK23ey7q1_fa5BS9i4_I" title="Pique-nique" />
            <GalleryThumb src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFGL5XsfLjYFXN0c0bISM3PbxYJdISyrMw3NEuE-rOWm3zeK6RqonY52HdYn42bqbRn2URNvi2wvZ5fO0cUqSEApgR6usi3pWN76SvwTkQswo19CV0G8ppM21XNUQtS6KXZIcmwHJcAh4Ur5OPsEH90XPdJ60tvmPxDOVP_FCe3Fth8ZfdreEzxwcR-dbXY-h4Ei3-WkM-1PRBWnaiRzIdc7lor49kfA3Gjxz1tEnCpOUoR9WM3uE6EZODaj55Re3FPai-Di9R" title="Adoration" />
            <GalleryThumb src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEEAPw7qIPLuO71Jx4uAwbBixkRFt4mA05dF22OxTktbRA8oSzhhoZrmXfQ-bZyhWD1-3_baD79wi78VnodxR193hCmVv4sWfiyWV2jtqC4WgPDatWv8PUYdW6N_1tNjbpPH3Hd7_giGMvmkond7tDcqJssTVqVqAxlVOSi3iccGTdDavZt-Hc8GeB7UtGiGp8nHFUUg-oftMT1TAAKfnFLu1ZPn_IbX2g0-fUwD1YtqVTCoX-mm1RHwFrDHzg8aXkbfJM0S2F" title="Communion" />
          </div>
        </div>
      </section>
    </div>
  );
};

const VideoCard = ({ thumbnail, duration, title, category, date, speaker }: any) => (
  <article className="group cursor-pointer space-y-4">
    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200">
      <img src={thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={title} />
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

const GalleryThumb = ({ src, title }: { src: string, title: string }) => (
  <div className="relative group aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer">
    <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={title} />
    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-end p-6">
      <p className="text-white font-bold text-lg font-serif">{title}</p>
    </div>
  </div>
);

export default Media;
