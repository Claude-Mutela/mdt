/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')
router.on('/a-propos').renderInertia('a-propos', {}).as('apropos')
router.on('/media').renderInertia('media', {}).as('media')
router.on('/gallery').renderInertia('gallery', {}).as('gallery')
router.on('/allContent').renderInertia('allContent', {}).as('allContent')
router.get('/ministries', ({ inertia }) => {
  return inertia.render('ministries', { ministries })
}).as('ministries')

const ministries = [
  {
    name: "Génération PHILA",
    slug: "generation-phila",
    tag: "Jeunesse",
    desc: "Un espace dynamique pour les 15-30 ans. Rencontres, débats et sorties spirituelles.",
    content: "Génération PHILA est le département des jeunes de la Maison de Témoignages. Notre mission est d'équiper une génération de jeunes leaders passionnés par le Christ et influents dans leur société. Nous organisons des cultes de jeunesse, des ateliers de formation, des sorties récréatives et des temps d'évangélisation.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIbFMjESOdJHHxt5ZZqh6b5UfaXUXTQi-r-Pn_dpK13bKHsrUOcOgYvL5hSwszN-fBAGYqMNvThd9j_qylXCXQl_gACFYQsemOmMb7BCtn9iXdu4S3tWQh1KKoi5G4VDjYcfQ4p41JF3l_vkr1ava2cJ3i5sIw-KGO6pb6945y6oe1XOTR8oZfVWvHwPe8ByoBP9gkFNYaScNJNV41Cvk2R9eYWs_pqeWKPnxkZ3zuT-ghwSIclLs04vAPudYCJkhbY07TqYYE",
    color: "bg-blue-500"
  },
  {
    name: "École du Dimanche",
    slug: "ecole-du-dimanche",
    tag: "Enfants",
    desc: "Les enfants découvrent la Bible à travers des jeux, des chants et des leçons adaptées.",
    content: "L'École du Dimanche est dédiée à l'édification spirituelle de nos enfants de 3 à 12 ans. À travers un programme pédagogique adapté, des chants, des jeux et des histoires bibliques, nous posons les fondements d'une foi solide dès le plus jeune âge.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdFseA8Z3bGd5tsZ7_dXrL55PmKqiWEZ6EeZDgcKPEr2oOXznXDvBR6JhRnGIkRIi_juzYyEH95Fp_yu4g40qLDr7t8BDNPrGujov-eGn8s-2Cu72pEpTw_GVrajccOhNlJBqUtgInzjpW72Xvz1wU0QbT7FaObZmdgi244s4AMSmqKBBbRMUyiOINaD1SDONAHZy4iBpG9IwYd9cF1l1eXmgoPe9ZeC45Z2m9n_hJPU7tC7XQ3lJ5-2orpr4VwsF-Wib4ifGE",
    color: "bg-green-500"
  },
  {
    name: "Chorale & Louange",
    slug: "chorale-louange",
    tag: "Musique",
    desc: "Conduire le peuple de Dieu dans l'adoration avec excellence et passion.",
    content: "Le ministère de louange et d'adoration de la MDT aspire à créer une atmosphère propice à la rencontre avec Dieu. Par l'excellence musicale et la consécration spirituelle, nous conduisons la communauté dans la présence du Seigneur à chaque culte.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1C9BNA27ZjKiZfZDzrvFd_qZd_gVwL8Ua2Axxv44Ne4qDTy5mKUQpXd7hOEuVuvsiPf69kDSDMlCmvMn39QUTk_d7ku3c2T_JtNCMRiR0a24eAyWNK_yp5ccVQGdxp5r0-yV8NmQ2qXxlCVXrdrPYd7uXJ0vmf6ISAmuNcFwc9PV6LalhpnHWGXFCmAz9KUv5K6DQCpOkMo_ehPVZ-4ElseBB5sw-0r03dB9CJELpD0zQLQzrurib4izE87yVOiodsupo3mPI",
    color: "bg-purple-500"
  },
  {
    name: "Femmes de Valeur",
    slug: "femmes-de-valeur",
    tag: "Femmes",
    desc: "Partage, prière et encouragement entre femmes pour s'édifier mutuellement.",
    content: "Femmes de Valeur est un cadre d'épanouissement, de prière et d'impact pour toutes les femmes. Nous croyons que chaque femme a une mission divine et nous travaillons à les équiper pour briller dans leur foyer, l'église et la société.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnA16G33hSttxKgEVt1Nizt3G00UsdsezYwrYAYadKkra-n8rM12Dq298M-NXIpBV8I8iJvSqmi1be37eggD627xUPBp7HEpVBkC1q631l1Jh3_VjBfIgcPWVwXJcbMgYzL-lMKkCeki6syqv4akER3CR6R4l6T3O1zfy7kUy6_74TgZdBmjSoSD7F4HpQpFPU35P0jm9r6pJq2haJlOwzm_SAmXftvfWCjCvII7nzYxDg2YN25WzSvPSND0CxBy0fyqmMjry1",
    color: "bg-pink-500"
  },
  {
    name: "Intercession & Prière MDT",
    slug: "intercession-priere",
    tag: "Prière",
    desc: "Un programme de prières 24h/24, 7j/7 pour couvrir l'église, les familles et les nations dans la prière.",
    content: `Le ministère d'Intercession & Prière MDT est le pilier spirituel de la Maison de Témoignages. Nous croyons que la prière est la clé de toute victoire et transformation.

Notre programme Allô Prière MDT fonctionne 24 heures sur 24, 7 jours sur 7, avec des équipes de priants dédiés qui se relaient sans interruption pour intercéder pour :
• Les membres et leurs familles
• Les malades et personnes dans le besoin
• Notre nation et ses dirigeants
• L'Église universelle du Christ

Que vous traversiez une épreuve, ayez besoin d'une percée spirituelle ou souhaitiez rejoindre notre équipe d'intercesseurs, nos lignes sont toujours ouvertes.

Contactez-nous :
📞 +243 97 000 0001
📞 +243 82 000 0002

Nous croyons que la prière change tout. Rejoignez le mouvement de prière continue de la MDT et vivez l'expérience de la puissance de Dieu dans votre vie.`,
    img: "/temple-jeudi-etoko.jpeg",
    color: "bg-[#2A9D8F]"
  }
]

router.get('/activites/:slug', ({ params, inertia }) => {
  const activity = ministries.find((m) => m.slug === params.slug)
  if (!activity) {
    return inertia.render('errors/not_found', {})
  }
  return inertia.render('detail-activite', { activity })
}).as('activites.detail')

const events = [
  {
    title: "Séminaire - Épanouissement Spirituel",
    slug: "seminaire-epanouissement",
    status: "upcoming",
    date: "15 Avril 2025 à 17h30",
    location: "Temple PHILA MDT, Kinshasa",
    description: "Une semaine d'immersion totale dans la Parole pour une transformation radicale.",
    content: "Nous vous convions à une série d'enseignements exceptionnels portés sur la croissance spirituelle. Ce séminaire est une opportunité unique pour tout chrétien désireux d'approfondir sa relation avec Dieu et de découvrir les clés d'un épanouissement durable dans sa vie de foi.",
    tag: "Séminaire",
    image: "/aksanti-mungu-mdt.jpeg"
  },
  {
    title: "Conférence de Jeunesse - Passion & Vision",
    slug: "conference-jeunesse-passion",
    status: "ongoing",
    date: "En cours (Jusqu'au 5 Avril)",
    location: "Salle des fêtes MDT",
    description: "Le rendez-vous annuel de la jeunesse pour embrasser sa destinée prophetique.",
    content: "Génération PHILA revient cette année avec une conférence dynamique. Des orateurs nationaux et internationaux se relaient pour équiper la jeunesse face aux défis du 21ème siècle, tout en gardant une passion inébranlable pour l'Évangile.",
    tag: "Jeunesse",
    image: "/dimanche-mdt.jpeg"
  },
  {
    title: "Grande Soirée d'Intercession - RD Congo",
    slug: "soiree-intercession-congo",
    status: "past",
    date: "28 Mars 2025",
    location: "Parvis de l'Église",
    description: "Un moment solennel de prière pour la paix et la restauration de notre nation.",
    content: "Revivez les moments forts de cette soirée d'intercession. Plus de 3 heures de prière fervente pour le pays, les institutions et la paix en République Démocratique du Congo. Des témoignages de guérison et de restauration ont marqué cette rencontre inoubliable.",
    tag: "Prière",
    image: "/hospitalite-mdt.jpeg"
  }
]

router.get('/evenements', ({ inertia }) => {
  return inertia.render('evenements', { events })
}).as('evenements')

router.get('/evenements/:slug', ({ params, inertia }) => {
  const event = events.find((e) => e.slug === params.slug)
  if (!event) {
    return inertia.render('errors/not_found', {})
  }
  return inertia.render('detail-evenement', { event })
}).as('evenements.detail')

router.on('/agenda').renderInertia('agenda', {}).as('agenda')
router.on('/cellules').renderInertia('cellules', {}).as('cellules')

router.on('/contact').renderInertia('contact', {}).as('contact')
router.on('/rendez-vous').renderInertia('rendez-vous', {}).as('rendez-vous')
router.on('/donation').renderInertia('donation', {}).as('donation')

/* ── Auth routes ──────────────────────────────────────────────────── */
router
  .group(() => {
    router.get('login', [() => import('#controllers/auth_controller'), 'showLogin']).as('login')
    router.post('login', [() => import('#controllers/auth_controller'), 'login']).as('login.store')
  })
  .use(middleware.guest())

router.post('logout', [() => import('#controllers/auth_controller'), 'logout']).as('logout').use(middleware.auth())

/* ── Admin routes ─────────────────────────────────────────────────── */
router
  .group(() => {
    // Dashboard accessible à tous les connectés
    router.on('/').renderInertia('admin/dashboard', {}).as('admin.dashboard')

    // Gestion des utilisateurs : Uniquement SUPERADMIN
    router
      .group(() => {
        router.get('/users', [() => import('#controllers/admin_users_controller'), 'index']).as('admin.users.index')
        router.post('/users', [() => import('#controllers/admin_users_controller'), 'store']).as('admin.users.store')
        router.put('/users/:id', [() => import('#controllers/admin_users_controller'), 'update']).as('admin.users.update')
        router.delete('/users/:id', [() => import('#controllers/admin_users_controller'), 'destroy']).as('admin.users.destroy')
      })
      .use(middleware.role({ allowedRoles: ['superadmin'] }))

    // Sections partagées entre SUPERADMIN, ADMIN et PASTEUR
    router
      .group(() => {
        router.get('/agenda', [() => import('#controllers/admin_agenda_controller'), 'index']).as('admin.agenda')
        router.post('/agenda', [() => import('#controllers/admin_agenda_controller'), 'store']).as('admin.agenda.store')
        router.put('/agenda/:id', [() => import('#controllers/admin_agenda_controller'), 'update']).as('admin.agenda.update')
        router.delete('/agenda/:id', [() => import('#controllers/admin_agenda_controller'), 'destroy']).as('admin.agenda.destroy')
        
        router.post('/agenda/categories', [() => import('#controllers/admin_agenda_controller'), 'storeCategory']).as('admin.agenda.categories.store')
        router.put('/agenda/categories/:id', [() => import('#controllers/admin_agenda_controller'), 'updateCategory']).as('admin.agenda.categories.update')
        router.delete('/agenda/categories/:id', [() => import('#controllers/admin_agenda_controller'), 'destroyCategory']).as('admin.agenda.categories.destroy')
        
        router.on('/rendez-vous').renderInertia('admin/rendez-vous', {}).as('admin.rendez-vous')
        router.get('/assets', [() => import('#controllers/admin_assets_controller'), 'index']).as('admin.assets')
        router.post('/assets', [() => import('#controllers/admin_assets_controller'), 'store']).as('admin.assets.store')
        router.patch('/assets/:id/activate', [() => import('#controllers/admin_assets_controller'), 'activate']).as('admin.assets.activate')
        router.patch('/assets/:id/deactivate', [() => import('#controllers/admin_assets_controller'), 'deactivate']).as('admin.assets.deactivate')
        router.delete('/assets/:id', [() => import('#controllers/admin_assets_controller'), 'destroy']).as('admin.assets.destroy')
        router.get('/evenements', [() => import('#controllers/admin_events_controller'), 'index']).as('admin.evenements')
        router.post('/evenements', [() => import('#controllers/admin_events_controller'), 'store']).as('admin.evenements.store')
        router.put('/evenements/:id', [() => import('#controllers/admin_events_controller'), 'update']).as('admin.evenements.update')
        router.delete('/evenements/:id', [() => import('#controllers/admin_events_controller'), 'destroy']).as('admin.evenements.destroy')
        router.post('/evenements/categories', [() => import('#controllers/admin_events_controller'), 'storeCategory']).as('admin.evenements.categories.store')
        router.put('/evenements/categories/:id', [() => import('#controllers/admin_events_controller'), 'updateCategory']).as('admin.evenements.categories.update')
        router.delete('/evenements/categories/:id', [() => import('#controllers/admin_events_controller'), 'destroyCategory']).as('admin.evenements.categories.destroy')
        router.get('/medias', [() => import('#controllers/admin_medias_controller'), 'index']).as('admin.medias')
        router.post('/medias', [() => import('#controllers/admin_medias_controller'), 'store']).as('admin.medias.store')
        router.put('/medias/:id', [() => import('#controllers/admin_medias_controller'), 'update']).as('admin.medias.update')
        router.delete('/medias/:id', [() => import('#controllers/admin_medias_controller'), 'destroy']).as('admin.medias.destroy')
        router.post('/medias/categories', [() => import('#controllers/admin_medias_controller'), 'storeCategory']).as('admin.medias.categories.store')
        router.put('/medias/categories/:id', [() => import('#controllers/admin_medias_controller'), 'updateCategory']).as('admin.medias.categories.update')
        router.delete('/medias/categories/:id', [() => import('#controllers/admin_medias_controller'), 'destroyCategory']).as('admin.medias.categories.destroy')
        router.on('/galerie').renderInertia('admin/galerie', {}).as('admin.galerie')
      })
      .use(middleware.role({ allowedRoles: ['superadmin', 'admin', 'pasteur'] }))

    // Sections accessibles à TOUT LE MONDE (SuperAdmin, Admin, Pasteur, User)
    router
      .group(() => {
        router.get('/membres/print', [() => import('#controllers/admin_members_controller'), 'print']).as('admin.membres.print')
        router.get('/membres', [() => import('#controllers/admin_members_controller'), 'index']).as('admin.membres')
        router.post('/members', [() => import('#controllers/admin_members_controller'), 'store']).as('admin.members.store')
        router.put('/members/:id', [() => import('#controllers/admin_members_controller'), 'update']).as('admin.members.update')
        router.delete('/members/:id', [() => import('#controllers/admin_members_controller'), 'destroy']).as('admin.members.destroy')
        
        router.get('/ministeres', [() => import('#controllers/admin_ministries_controller'), 'index']).as('admin.ministeres')
        router.post('/ministeres', [() => import('#controllers/admin_ministries_controller'), 'storeMinistry']).as('admin.ministeres.store')
        router.put('/ministeres/:id', [() => import('#controllers/admin_ministries_controller'), 'updateMinistry']).as('admin.ministeres.update')
        router.delete('/ministeres/:id', [() => import('#controllers/admin_ministries_controller'), 'destroyMinistry']).as('admin.ministeres.destroy')
        
        router.on('/donations').renderInertia('admin/donations', {}).as('admin.donations')
      })
      .use(middleware.role({ allowedRoles: ['superadmin', 'admin', 'pasteur', 'user'] }))
  })
  .prefix('/admin')
  .use(middleware.auth())

