import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'apropos': { paramsTuple?: []; params?: {} }
    'media': { paramsTuple?: []; params?: {} }
    'gallery': { paramsTuple?: []; params?: {} }
    'gallery.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'allContent': { paramsTuple?: []; params?: {} }
    'ministries': { paramsTuple?: []; params?: {} }
    'ministeres.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'evenements': { paramsTuple?: []; params?: {} }
    'evenements.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'agenda': { paramsTuple?: []; params?: {} }
    'cellules': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'contact.store': { paramsTuple?: []; params?: {} }
    'rendez-vous.index': { paramsTuple?: []; params?: {} }
    'rendez-vous.store': { paramsTuple?: []; params?: {} }
    'donation': { paramsTuple?: []; params?: {} }
    'intercession': { paramsTuple?: []; params?: {} }
    'newsletter.store': { paramsTuple?: []; params?: {} }
    'newsletter.confirm': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'logout': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda': { paramsTuple?: []; params?: {} }
    'admin.agenda.store': { paramsTuple?: []; params?: {} }
    'admin.agenda.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.categories.store': { paramsTuple?: []; params?: {} }
    'admin.agenda.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.assets': { paramsTuple?: []; params?: {} }
    'admin.assets.store': { paramsTuple?: []; params?: {} }
    'admin.assets.activate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.assets.deactivate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.assets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements': { paramsTuple?: []; params?: {} }
    'admin.evenements.store': { paramsTuple?: []; params?: {} }
    'admin.evenements.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.categories.store': { paramsTuple?: []; params?: {} }
    'admin.evenements.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias': { paramsTuple?: []; params?: {} }
    'admin.medias.store': { paramsTuple?: []; params?: {} }
    'admin.medias.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.categories.store': { paramsTuple?: []; params?: {} }
    'admin.medias.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie': { paramsTuple?: []; params?: {} }
    'admin.galerie.albums.store': { paramsTuple?: []; params?: {} }
    'admin.galerie.albums.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.albums.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.photos.store': { paramsTuple?: []; params?: {} }
    'admin.galerie.photos.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.photos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.categories.store': { paramsTuple?: []; params?: {} }
    'admin.galerie.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.ministeres': { paramsTuple?: []; params?: {} }
    'admin.ministeres.store': { paramsTuple?: []; params?: {} }
    'admin.ministeres.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.ministeres.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.cellules': { paramsTuple?: []; params?: {} }
    'admin.cellules.responsables': { paramsTuple?: []; params?: {} }
    'admin.cellules.store': { paramsTuple?: []; params?: {} }
    'admin.cellules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.cellules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.newsletter': { paramsTuple?: []; params?: {} }
    'admin.newsletter.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.membres.print': { paramsTuple?: []; params?: {} }
    'admin.membres': { paramsTuple?: []; params?: {} }
    'admin.members.store': { paramsTuple?: []; params?: {} }
    'admin.members.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.members.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.rendez-vous': { paramsTuple?: []; params?: {} }
    'admin.rendez-vous.print': { paramsTuple?: []; params?: {} }
    'admin.rendez-vous.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.rendez-vous.reschedule': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.rendez-vous.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.nouveaux_venus.print': { paramsTuple?: []; params?: {} }
    'admin.nouveaux_venus': { paramsTuple?: []; params?: {} }
    'admin.newcomers.store': { paramsTuple?: []; params?: {} }
    'admin.newcomers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.newcomers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.finances.operations.store': { paramsTuple?: []; params?: {} }
    'admin.finances.operations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.operations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.categories.store': { paramsTuple?: []; params?: {} }
    'admin.finances.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.rates.update': { paramsTuple?: []; params?: {} }
    'admin.donations': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'apropos': { paramsTuple?: []; params?: {} }
    'media': { paramsTuple?: []; params?: {} }
    'gallery': { paramsTuple?: []; params?: {} }
    'gallery.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'allContent': { paramsTuple?: []; params?: {} }
    'ministries': { paramsTuple?: []; params?: {} }
    'ministeres.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'evenements': { paramsTuple?: []; params?: {} }
    'evenements.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'agenda': { paramsTuple?: []; params?: {} }
    'cellules': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'rendez-vous.index': { paramsTuple?: []; params?: {} }
    'donation': { paramsTuple?: []; params?: {} }
    'intercession': { paramsTuple?: []; params?: {} }
    'newsletter.confirm': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.agenda': { paramsTuple?: []; params?: {} }
    'admin.assets': { paramsTuple?: []; params?: {} }
    'admin.evenements': { paramsTuple?: []; params?: {} }
    'admin.medias': { paramsTuple?: []; params?: {} }
    'admin.galerie': { paramsTuple?: []; params?: {} }
    'admin.ministeres': { paramsTuple?: []; params?: {} }
    'admin.cellules': { paramsTuple?: []; params?: {} }
    'admin.cellules.responsables': { paramsTuple?: []; params?: {} }
    'admin.newsletter': { paramsTuple?: []; params?: {} }
    'admin.membres.print': { paramsTuple?: []; params?: {} }
    'admin.membres': { paramsTuple?: []; params?: {} }
    'admin.rendez-vous': { paramsTuple?: []; params?: {} }
    'admin.rendez-vous.print': { paramsTuple?: []; params?: {} }
    'admin.nouveaux_venus.print': { paramsTuple?: []; params?: {} }
    'admin.nouveaux_venus': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.donations': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'apropos': { paramsTuple?: []; params?: {} }
    'media': { paramsTuple?: []; params?: {} }
    'gallery': { paramsTuple?: []; params?: {} }
    'gallery.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'allContent': { paramsTuple?: []; params?: {} }
    'ministries': { paramsTuple?: []; params?: {} }
    'ministeres.show': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'evenements': { paramsTuple?: []; params?: {} }
    'evenements.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'agenda': { paramsTuple?: []; params?: {} }
    'cellules': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'rendez-vous.index': { paramsTuple?: []; params?: {} }
    'donation': { paramsTuple?: []; params?: {} }
    'intercession': { paramsTuple?: []; params?: {} }
    'newsletter.confirm': { paramsTuple?: []; params?: {} }
    'login': { paramsTuple?: []; params?: {} }
    'auth.verify_email': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.users.index': { paramsTuple?: []; params?: {} }
    'admin.agenda': { paramsTuple?: []; params?: {} }
    'admin.assets': { paramsTuple?: []; params?: {} }
    'admin.evenements': { paramsTuple?: []; params?: {} }
    'admin.medias': { paramsTuple?: []; params?: {} }
    'admin.galerie': { paramsTuple?: []; params?: {} }
    'admin.ministeres': { paramsTuple?: []; params?: {} }
    'admin.cellules': { paramsTuple?: []; params?: {} }
    'admin.cellules.responsables': { paramsTuple?: []; params?: {} }
    'admin.newsletter': { paramsTuple?: []; params?: {} }
    'admin.membres.print': { paramsTuple?: []; params?: {} }
    'admin.membres': { paramsTuple?: []; params?: {} }
    'admin.rendez-vous': { paramsTuple?: []; params?: {} }
    'admin.rendez-vous.print': { paramsTuple?: []; params?: {} }
    'admin.nouveaux_venus.print': { paramsTuple?: []; params?: {} }
    'admin.nouveaux_venus': { paramsTuple?: []; params?: {} }
    'admin.finances': { paramsTuple?: []; params?: {} }
    'admin.donations': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'contact.store': { paramsTuple?: []; params?: {} }
    'rendez-vous.store': { paramsTuple?: []; params?: {} }
    'newsletter.store': { paramsTuple?: []; params?: {} }
    'login.store': { paramsTuple?: []; params?: {} }
    'logout': { paramsTuple?: []; params?: {} }
    'admin.users.store': { paramsTuple?: []; params?: {} }
    'admin.agenda.store': { paramsTuple?: []; params?: {} }
    'admin.agenda.categories.store': { paramsTuple?: []; params?: {} }
    'admin.assets.store': { paramsTuple?: []; params?: {} }
    'admin.evenements.store': { paramsTuple?: []; params?: {} }
    'admin.evenements.categories.store': { paramsTuple?: []; params?: {} }
    'admin.medias.store': { paramsTuple?: []; params?: {} }
    'admin.medias.categories.store': { paramsTuple?: []; params?: {} }
    'admin.galerie.albums.store': { paramsTuple?: []; params?: {} }
    'admin.galerie.photos.store': { paramsTuple?: []; params?: {} }
    'admin.galerie.categories.store': { paramsTuple?: []; params?: {} }
    'admin.ministeres.store': { paramsTuple?: []; params?: {} }
    'admin.cellules.store': { paramsTuple?: []; params?: {} }
    'admin.members.store': { paramsTuple?: []; params?: {} }
    'admin.newcomers.store': { paramsTuple?: []; params?: {} }
    'admin.finances.operations.store': { paramsTuple?: []; params?: {} }
    'admin.finances.categories.store': { paramsTuple?: []; params?: {} }
    'admin.finances.rates.update': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'admin.users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.albums.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.photos.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.ministeres.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.cellules.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.members.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.rendez-vous.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.newcomers.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.operations.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'admin.users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.agenda.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.assets.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.evenements.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.medias.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.albums.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.photos.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.galerie.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.ministeres.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.cellules.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.newsletter.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.members.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.rendez-vous.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.newcomers.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.operations.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.finances.categories.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'admin.assets.activate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.assets.deactivate': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'admin.rendez-vous.reschedule': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}