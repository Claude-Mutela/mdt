import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'apropos': { paramsTuple?: []; params?: {} }
    'media': { paramsTuple?: []; params?: {} }
    'gallery': { paramsTuple?: []; params?: {} }
    'allContent': { paramsTuple?: []; params?: {} }
    'ministries': { paramsTuple?: []; params?: {} }
    'activites.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'evenements': { paramsTuple?: []; params?: {} }
    'evenements.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'agenda': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'donation': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.membres': { paramsTuple?: []; params?: {} }
    'admin.agenda': { paramsTuple?: []; params?: {} }
    'admin.ministeres': { paramsTuple?: []; params?: {} }
    'admin.evenements': { paramsTuple?: []; params?: {} }
    'admin.medias': { paramsTuple?: []; params?: {} }
    'admin.galerie': { paramsTuple?: []; params?: {} }
    'admin.donations': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'apropos': { paramsTuple?: []; params?: {} }
    'media': { paramsTuple?: []; params?: {} }
    'gallery': { paramsTuple?: []; params?: {} }
    'allContent': { paramsTuple?: []; params?: {} }
    'ministries': { paramsTuple?: []; params?: {} }
    'activites.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'evenements': { paramsTuple?: []; params?: {} }
    'evenements.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'agenda': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'donation': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.membres': { paramsTuple?: []; params?: {} }
    'admin.agenda': { paramsTuple?: []; params?: {} }
    'admin.ministeres': { paramsTuple?: []; params?: {} }
    'admin.evenements': { paramsTuple?: []; params?: {} }
    'admin.medias': { paramsTuple?: []; params?: {} }
    'admin.galerie': { paramsTuple?: []; params?: {} }
    'admin.donations': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'apropos': { paramsTuple?: []; params?: {} }
    'media': { paramsTuple?: []; params?: {} }
    'gallery': { paramsTuple?: []; params?: {} }
    'allContent': { paramsTuple?: []; params?: {} }
    'ministries': { paramsTuple?: []; params?: {} }
    'activites.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'evenements': { paramsTuple?: []; params?: {} }
    'evenements.detail': { paramsTuple: [ParamValue]; params: {'slug': ParamValue} }
    'agenda': { paramsTuple?: []; params?: {} }
    'contact': { paramsTuple?: []; params?: {} }
    'donation': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
    'admin.membres': { paramsTuple?: []; params?: {} }
    'admin.agenda': { paramsTuple?: []; params?: {} }
    'admin.ministeres': { paramsTuple?: []; params?: {} }
    'admin.evenements': { paramsTuple?: []; params?: {} }
    'admin.medias': { paramsTuple?: []; params?: {} }
    'admin.galerie': { paramsTuple?: []; params?: {} }
    'admin.donations': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}