/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
    }
  }
  'apropos': {
    methods: ["GET","HEAD"]
    pattern: '/a-propos'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'media': {
    methods: ["GET","HEAD"]
    pattern: '/media'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['index']>>>
    }
  }
  'gallery': {
    methods: ["GET","HEAD"]
    pattern: '/gallery'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/galeries_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/galeries_controller').default['index']>>>
    }
  }
  'gallery.show': {
    methods: ["GET","HEAD"]
    pattern: '/gallery/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/galeries_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/galeries_controller').default['show']>>>
    }
  }
  'allContent': {
    methods: ["GET","HEAD"]
    pattern: '/allContent'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/media_controller').default['allContent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/media_controller').default['allContent']>>>
    }
  }
  'ministries': {
    methods: ["GET","HEAD"]
    pattern: '/ministries'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ministries_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ministries_controller').default['index']>>>
    }
  }
  'ministeres.show': {
    methods: ["GET","HEAD"]
    pattern: '/ministeres/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/ministries_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/ministries_controller').default['show']>>>
    }
  }
  'evenements': {
    methods: ["GET","HEAD"]
    pattern: '/evenements'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['index']>>>
    }
  }
  'evenements.detail': {
    methods: ["GET","HEAD"]
    pattern: '/evenements/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/events_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/events_controller').default['show']>>>
    }
  }
  'agenda': {
    methods: ["GET","HEAD"]
    pattern: '/agenda'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/agenda_controller').default['index']>>>
    }
  }
  'cellules': {
    methods: ["GET","HEAD"]
    pattern: '/cellules'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/cellules_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/cellules_controller').default['index']>>>
    }
  }
  'contact': {
    methods: ["GET","HEAD"]
    pattern: '/contact'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['index']>>>
    }
  }
  'contact.store': {
    methods: ["POST"]
    pattern: '/contact'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/contact').contactValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/contact').contactValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/contact_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'rendez-vous.index': {
    methods: ["GET","HEAD"]
    pattern: '/rendez-vous'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/appointments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/appointments_controller').default['index']>>>
    }
  }
  'rendez-vous.store': {
    methods: ["POST"]
    pattern: '/rendez-vous'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/appointment').appointmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/appointment').appointmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/appointments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/appointments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'donation': {
    methods: ["GET","HEAD"]
    pattern: '/donation'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'intercession': {
    methods: ["GET","HEAD"]
    pattern: '/intercession-priere'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'newsletter.store': {
    methods: ["POST"]
    pattern: '/newsletter'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/newsletter_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/newsletter_controller').default['store']>>>
    }
  }
  'newsletter.confirm': {
    methods: ["GET","HEAD"]
    pattern: '/newsletter/confirmer'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/newsletter_controller').default['confirm']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/newsletter_controller').default['confirm']>>>
    }
  }
  'login': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['showLogin']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['showLogin']>>>
    }
  }
  'login.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['login']>>>
    }
  }
  'auth.verify_email': {
    methods: ["GET","HEAD"]
    pattern: '/verifier-compte/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['verifyEmail']>>>
    }
  }
  'logout': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth_controller').default['logout']>>>
    }
  }
  'admin.dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/admin'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_dashboard_controller').default['index']>>>
    }
  }
  'admin.users.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['index']>>>
    }
  }
  'admin.users.store': {
    methods: ["POST"]
    pattern: '/admin/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_user').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_user').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.update': {
    methods: ["PUT"]
    pattern: '/admin/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_user').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_user').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_users_controller').default['destroy']>>>
    }
  }
  'admin.agenda': {
    methods: ["GET","HEAD"]
    pattern: '/admin/agenda'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['index']>>>
    }
  }
  'admin.agenda.store': {
    methods: ["POST"]
    pattern: '/admin/agenda'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').agendaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').agendaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.agenda.update': {
    methods: ["PUT"]
    pattern: '/admin/agenda/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').agendaValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').agendaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.agenda.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/agenda/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['destroy']>>>
    }
  }
  'admin.agenda.categories.store': {
    methods: ["POST"]
    pattern: '/admin/agenda/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').catActivityValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').catActivityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['storeCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.agenda.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/agenda/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/agenda').catActivityValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/agenda').catActivityValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.agenda.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/agenda/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['destroyCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_agenda_controller').default['destroyCategory']>>>
    }
  }
  'admin.assets': {
    methods: ["GET","HEAD"]
    pattern: '/admin/assets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['index']>>>
    }
  }
  'admin.assets.store': {
    methods: ["POST"]
    pattern: '/admin/assets'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/hero_asset').heroAssetValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/hero_asset').heroAssetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.assets.activate': {
    methods: ["PATCH"]
    pattern: '/admin/assets/:id/activate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['activate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['activate']>>>
    }
  }
  'admin.assets.deactivate': {
    methods: ["PATCH"]
    pattern: '/admin/assets/:id/deactivate'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['deactivate']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['deactivate']>>>
    }
  }
  'admin.assets.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/assets/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_assets_controller').default['destroy']>>>
    }
  }
  'admin.evenements': {
    methods: ["GET","HEAD"]
    pattern: '/admin/evenements'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['index']>>>
    }
  }
  'admin.evenements.store': {
    methods: ["POST"]
    pattern: '/admin/evenements'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').createEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/event').createEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.evenements.update': {
    methods: ["PUT"]
    pattern: '/admin/evenements/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').updateEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/event').updateEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.evenements.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/evenements/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['destroy']>>>
    }
  }
  'admin.evenements.categories.store': {
    methods: ["POST"]
    pattern: '/admin/evenements/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').catEventValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/event').catEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['storeCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.evenements.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/evenements/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/event').catEventValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/event').catEventValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.evenements.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/evenements/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['destroyCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_events_controller').default['destroyCategory']>>>
    }
  }
  'admin.medias': {
    methods: ["GET","HEAD"]
    pattern: '/admin/medias'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['index']>>>
    }
  }
  'admin.medias.store': {
    methods: ["POST"]
    pattern: '/admin/medias'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').createMediaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media').createMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.medias.update': {
    methods: ["PUT"]
    pattern: '/admin/medias/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').updateMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/media').updateMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.medias.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/medias/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['destroy']>>>
    }
  }
  'admin.medias.categories.store': {
    methods: ["POST"]
    pattern: '/admin/medias/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').catMediaValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/media').catMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['storeCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.medias.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/medias/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/media').catMediaValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/media').catMediaValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.medias.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/medias/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['destroyCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_medias_controller').default['destroyCategory']>>>
    }
  }
  'admin.galerie': {
    methods: ["GET","HEAD"]
    pattern: '/admin/galerie'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['index']>>>
    }
  }
  'admin.galerie.albums.store': {
    methods: ["POST"]
    pattern: '/admin/galerie/albums'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gallery').createGalleryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gallery').createGalleryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['storeAlbum']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['storeAlbum']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.galerie.albums.update': {
    methods: ["PUT"]
    pattern: '/admin/galerie/albums/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gallery').updateGalleryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gallery').updateGalleryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['updateAlbum']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['updateAlbum']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.galerie.albums.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/galerie/albums/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['destroyAlbum']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['destroyAlbum']>>>
    }
  }
  'admin.galerie.photos.store': {
    methods: ["POST"]
    pattern: '/admin/galerie/photos'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gallery').createImageValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gallery').createImageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['storePhoto']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['storePhoto']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.galerie.photos.update': {
    methods: ["PUT"]
    pattern: '/admin/galerie/photos/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gallery').updateImageValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gallery').updateImageValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['updatePhoto']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['updatePhoto']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.galerie.photos.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/galerie/photos/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['destroyPhoto']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['destroyPhoto']>>>
    }
  }
  'admin.galerie.categories.store': {
    methods: ["POST"]
    pattern: '/admin/galerie/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gallery').catGalleryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/gallery').catGalleryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['storeCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.galerie.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/galerie/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/gallery').catGalleryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/gallery').catGalleryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.galerie.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/galerie/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['destroyCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_galeries_controller').default['destroyCategory']>>>
    }
  }
  'admin.ministeres': {
    methods: ["GET","HEAD"]
    pattern: '/admin/ministeres'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['index']>>>
    }
  }
  'admin.ministeres.store': {
    methods: ["POST"]
    pattern: '/admin/ministeres'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ministry').ministryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/ministry').ministryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['storeMinistry']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['storeMinistry']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.ministeres.update': {
    methods: ["PUT"]
    pattern: '/admin/ministeres/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ministry').ministryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/ministry').ministryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['updateMinistry']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['updateMinistry']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.ministeres.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/ministeres/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['destroyMinistry']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_ministries_controller').default['destroyMinistry']>>>
    }
  }
  'admin.cellules': {
    methods: ["GET","HEAD"]
    pattern: '/admin/cellules'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['index']>>>
    }
  }
  'admin.cellules.responsables': {
    methods: ["GET","HEAD"]
    pattern: '/admin/cellules/responsables'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['responsables']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['responsables']>>>
    }
  }
  'admin.cellules.store': {
    methods: ["POST"]
    pattern: '/admin/cellules'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cellule').celluleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/cellule').celluleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.cellules.update': {
    methods: ["PUT"]
    pattern: '/admin/cellules/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/cellule').celluleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/cellule').celluleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.cellules.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/cellules/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_cellules_controller').default['destroy']>>>
    }
  }
  'admin.newsletter': {
    methods: ["GET","HEAD"]
    pattern: '/admin/newsletter'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newsletter_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newsletter_controller').default['index']>>>
    }
  }
  'admin.newsletter.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/newsletter/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newsletter_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newsletter_controller').default['destroy']>>>
    }
  }
  'admin.membres.print': {
    methods: ["GET","HEAD"]
    pattern: '/admin/membres/print'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['print']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['print']>>>
    }
  }
  'admin.membres': {
    methods: ["GET","HEAD"]
    pattern: '/admin/membres'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['index']>>>
    }
  }
  'admin.members.store': {
    methods: ["POST"]
    pattern: '/admin/members'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member').memberValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/member').memberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.members.update': {
    methods: ["PUT"]
    pattern: '/admin/members/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member').memberValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/member').memberValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.members.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/members/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_members_controller').default['destroy']>>>
    }
  }
  'admin.rendez-vous': {
    methods: ["GET","HEAD"]
    pattern: '/admin/rendez-vous'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['index']>>>
    }
  }
  'admin.rendez-vous.print': {
    methods: ["GET","HEAD"]
    pattern: '/admin/rendez-vous/print'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['print']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['print']>>>
    }
  }
  'admin.rendez-vous.update': {
    methods: ["PUT"]
    pattern: '/admin/rendez-vous/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/appointment').appointmentStatusValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/appointment').appointmentStatusValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.rendez-vous.reschedule': {
    methods: ["PATCH"]
    pattern: '/admin/rendez-vous/:id/reschedule'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/appointment').appointmentRescheduleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/appointment').appointmentRescheduleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['reschedule']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['reschedule']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.rendez-vous.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/rendez-vous/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_appointments_controller').default['destroy']>>>
    }
  }
  'admin.nouveaux_venus.print': {
    methods: ["GET","HEAD"]
    pattern: '/admin/nouveaux-venus/print'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['print']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['print']>>>
    }
  }
  'admin.nouveaux_venus': {
    methods: ["GET","HEAD"]
    pattern: '/admin/nouveaux-venus'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['index']>>>
    }
  }
  'admin.newcomers.store': {
    methods: ["POST"]
    pattern: '/admin/newcomers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/newcomer').newcomerValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/newcomer').newcomerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.newcomers.update': {
    methods: ["PUT"]
    pattern: '/admin/newcomers/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/newcomer').newcomerValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/newcomer').newcomerValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.newcomers.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/newcomers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_newcomers_controller').default['destroy']>>>
    }
  }
  'admin.finances': {
    methods: ["GET","HEAD"]
    pattern: '/admin/finances'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['index']>>>
    }
  }
  'admin.finances.operations.store': {
    methods: ["POST"]
    pattern: '/admin/finances/operations'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance_operation').financeOperationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance_operation').financeOperationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.finances.operations.update': {
    methods: ["PUT"]
    pattern: '/admin/finances/operations/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance_operation').financeOperationValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/finance_operation').financeOperationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.finances.operations.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/finances/operations/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['destroy']>>>
    }
  }
  'admin.finances.categories.store': {
    methods: ["POST"]
    pattern: '/admin/finances/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance_category').financeCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/finance_category').financeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['storeCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['storeCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.finances.categories.update': {
    methods: ["PUT"]
    pattern: '/admin/finances/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/finance_category').financeCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/finance_category').financeCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['updateCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['updateCategory']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.finances.categories.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/finances/categories/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['destroyCategory']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['destroyCategory']>>>
    }
  }
  'admin.finances.rates.update': {
    methods: ["POST"]
    pattern: '/admin/finances/rates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['updateRates']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin_finances_controller').default['updateRates']>>>
    }
  }
  'admin.donations': {
    methods: ["GET","HEAD"]
    pattern: '/admin/donations'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
}
