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

router.get('/', [() => import('#controllers/home_controller'), 'index']).as('home')
router.on('/a-propos').renderInertia('a-propos', {}).as('apropos')
router.get('/media', [() => import('#controllers/media_controller'), 'index']).as('media')
router.get('/gallery', [() => import('#controllers/galeries_controller'), 'index']).as('gallery')
router.get('/gallery/:slug', [() => import('#controllers/galeries_controller'), 'show']).as('gallery.show')
router.get('/allContent', [() => import('#controllers/media_controller'), 'allContent']).as('allContent')
router.get('/ministries', [() => import('#controllers/ministries_controller'), 'index']).as('ministries')
router.get('/ministeres/:slug', [() => import('#controllers/ministries_controller'), 'show']).as('ministeres.show')
router.get('/evenements', [() => import('#controllers/events_controller'), 'index']).as('evenements')
router.get('/evenements/:slug', [() => import('#controllers/events_controller'), 'show']).as('evenements.detail')
router.get('/agenda', [() => import('#controllers/agenda_controller'), 'index']).as('agenda')
router.get('/cellules', [() => import('#controllers/cellules_controller'), 'index']).as('cellules')
router.get('/contact', [() => import('#controllers/contact_controller'), 'index']).as('contact')
router.post('/contact', [() => import('#controllers/contact_controller'), 'store']).as('contact.store')
router.get('/rendez-vous', [() => import('#controllers/appointments_controller'), 'index']).as('rendez-vous.index')
router.post('/rendez-vous', [() => import('#controllers/appointments_controller'), 'store']).as('rendez-vous.store')
router.on('/donation').renderInertia('donation', {}).as('donation')
router.on('/intercession-priere').renderInertia('intercession-priere', {}).as('intercession')

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
    router.get('/', [() => import('#controllers/admin_dashboard_controller'), 'index']).as('admin.dashboard')

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
        
        router.get('/rendez-vous', [() => import('#controllers/admin_appointments_controller'), 'index']).as('admin.rendez-vous')
        router.put('/rendez-vous/:id', [() => import('#controllers/admin_appointments_controller'), 'update']).as('admin.rendez-vous.update')
        router.patch('/rendez-vous/:id/reschedule', [() => import('#controllers/admin_appointments_controller'), 'reschedule']).as('admin.rendez-vous.reschedule')
        router.delete('/rendez-vous/:id', [() => import('#controllers/admin_appointments_controller'), 'destroy']).as('admin.rendez-vous.destroy')
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
        router.get('/galerie', [() => import('#controllers/admin_galeries_controller'), 'index']).as('admin.galerie')
        router.post('/galerie/albums', [() => import('#controllers/admin_galeries_controller'), 'storeAlbum']).as('admin.galerie.albums.store')
        router.put('/galerie/albums/:id', [() => import('#controllers/admin_galeries_controller'), 'updateAlbum']).as('admin.galerie.albums.update')
        router.delete('/galerie/albums/:id', [() => import('#controllers/admin_galeries_controller'), 'destroyAlbum']).as('admin.galerie.albums.destroy')

        router.post('/galerie/photos', [() => import('#controllers/admin_galeries_controller'), 'storePhoto']).as('admin.galerie.photos.store')
        router.put('/galerie/photos/:id', [() => import('#controllers/admin_galeries_controller'), 'updatePhoto']).as('admin.galerie.photos.update')
        router.delete('/galerie/photos/:id', [() => import('#controllers/admin_galeries_controller'), 'destroyPhoto']).as('admin.galerie.photos.destroy')

        router.post('/galerie/categories', [() => import('#controllers/admin_galeries_controller'), 'storeCategory']).as('admin.galerie.categories.store')
        router.put('/galerie/categories/:id', [() => import('#controllers/admin_galeries_controller'), 'updateCategory']).as('admin.galerie.categories.update')
        router.delete('/galerie/categories/:id', [() => import('#controllers/admin_galeries_controller'), 'destroyCategory']).as('admin.galerie.categories.destroy')
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

        router.get('/cellules', [() => import('#controllers/admin_cellules_controller'), 'index']).as('admin.cellules')
        // Doit être AVANT /:id pour éviter un conflit de routing
        router.get('/cellules/responsables', [() => import('#controllers/admin_cellules_controller'), 'responsables']).as('admin.cellules.responsables')
        router.post('/cellules', [() => import('#controllers/admin_cellules_controller'), 'store']).as('admin.cellules.store')
        router.put('/cellules/:id', [() => import('#controllers/admin_cellules_controller'), 'update']).as('admin.cellules.update')
        router.delete('/cellules/:id', [() => import('#controllers/admin_cellules_controller'), 'destroy']).as('admin.cellules.destroy')
        
        router.on('/donations').renderInertia('admin/donations', {}).as('admin.donations')
      })
      .use(middleware.role({ allowedRoles: ['superadmin', 'admin', 'pasteur', 'user'] }))
  })
  .prefix('/admin')
  .use(middleware.auth())

