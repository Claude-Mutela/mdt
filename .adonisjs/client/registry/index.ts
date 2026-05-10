/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'apropos': {
    methods: ["GET","HEAD"],
    pattern: '/a-propos',
    tokens: [{"old":"/a-propos","type":0,"val":"a-propos","end":""}],
    types: placeholder as Registry['apropos']['types'],
  },
  'media': {
    methods: ["GET","HEAD"],
    pattern: '/media',
    tokens: [{"old":"/media","type":0,"val":"media","end":""}],
    types: placeholder as Registry['media']['types'],
  },
  'gallery': {
    methods: ["GET","HEAD"],
    pattern: '/gallery',
    tokens: [{"old":"/gallery","type":0,"val":"gallery","end":""}],
    types: placeholder as Registry['gallery']['types'],
  },
  'allContent': {
    methods: ["GET","HEAD"],
    pattern: '/allContent',
    tokens: [{"old":"/allContent","type":0,"val":"allContent","end":""}],
    types: placeholder as Registry['allContent']['types'],
  },
  'ministries': {
    methods: ["GET","HEAD"],
    pattern: '/ministries',
    tokens: [{"old":"/ministries","type":0,"val":"ministries","end":""}],
    types: placeholder as Registry['ministries']['types'],
  },
  'activites.detail': {
    methods: ["GET","HEAD"],
    pattern: '/activites/:slug',
    tokens: [{"old":"/activites/:slug","type":0,"val":"activites","end":""},{"old":"/activites/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['activites.detail']['types'],
  },
  'evenements': {
    methods: ["GET","HEAD"],
    pattern: '/evenements',
    tokens: [{"old":"/evenements","type":0,"val":"evenements","end":""}],
    types: placeholder as Registry['evenements']['types'],
  },
  'evenements.detail': {
    methods: ["GET","HEAD"],
    pattern: '/evenements/:slug',
    tokens: [{"old":"/evenements/:slug","type":0,"val":"evenements","end":""},{"old":"/evenements/:slug","type":1,"val":"slug","end":""}],
    types: placeholder as Registry['evenements.detail']['types'],
  },
  'agenda': {
    methods: ["GET","HEAD"],
    pattern: '/agenda',
    tokens: [{"old":"/agenda","type":0,"val":"agenda","end":""}],
    types: placeholder as Registry['agenda']['types'],
  },
  'cellules': {
    methods: ["GET","HEAD"],
    pattern: '/cellules',
    tokens: [{"old":"/cellules","type":0,"val":"cellules","end":""}],
    types: placeholder as Registry['cellules']['types'],
  },
  'contact': {
    methods: ["GET","HEAD"],
    pattern: '/contact',
    tokens: [{"old":"/contact","type":0,"val":"contact","end":""}],
    types: placeholder as Registry['contact']['types'],
  },
  'rendez-vous': {
    methods: ["GET","HEAD"],
    pattern: '/rendez-vous',
    tokens: [{"old":"/rendez-vous","type":0,"val":"rendez-vous","end":""}],
    types: placeholder as Registry['rendez-vous']['types'],
  },
  'donation': {
    methods: ["GET","HEAD"],
    pattern: '/donation',
    tokens: [{"old":"/donation","type":0,"val":"donation","end":""}],
    types: placeholder as Registry['donation']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin',
    tokens: [{"old":"/admin","type":0,"val":"admin","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
  'admin.users': {
    methods: ["GET","HEAD"],
    pattern: '/admin/users',
    tokens: [{"old":"/admin/users","type":0,"val":"admin","end":""},{"old":"/admin/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['admin.users']['types'],
  },
  'admin.membres': {
    methods: ["GET","HEAD"],
    pattern: '/admin/membres',
    tokens: [{"old":"/admin/membres","type":0,"val":"admin","end":""},{"old":"/admin/membres","type":0,"val":"membres","end":""}],
    types: placeholder as Registry['admin.membres']['types'],
  },
  'admin.agenda': {
    methods: ["GET","HEAD"],
    pattern: '/admin/agenda',
    tokens: [{"old":"/admin/agenda","type":0,"val":"admin","end":""},{"old":"/admin/agenda","type":0,"val":"agenda","end":""}],
    types: placeholder as Registry['admin.agenda']['types'],
  },
  'admin.ministeres': {
    methods: ["GET","HEAD"],
    pattern: '/admin/ministeres',
    tokens: [{"old":"/admin/ministeres","type":0,"val":"admin","end":""},{"old":"/admin/ministeres","type":0,"val":"ministeres","end":""}],
    types: placeholder as Registry['admin.ministeres']['types'],
  },
  'admin.evenements': {
    methods: ["GET","HEAD"],
    pattern: '/admin/evenements',
    tokens: [{"old":"/admin/evenements","type":0,"val":"admin","end":""},{"old":"/admin/evenements","type":0,"val":"evenements","end":""}],
    types: placeholder as Registry['admin.evenements']['types'],
  },
  'admin.medias': {
    methods: ["GET","HEAD"],
    pattern: '/admin/medias',
    tokens: [{"old":"/admin/medias","type":0,"val":"admin","end":""},{"old":"/admin/medias","type":0,"val":"medias","end":""}],
    types: placeholder as Registry['admin.medias']['types'],
  },
  'admin.galerie': {
    methods: ["GET","HEAD"],
    pattern: '/admin/galerie',
    tokens: [{"old":"/admin/galerie","type":0,"val":"admin","end":""},{"old":"/admin/galerie","type":0,"val":"galerie","end":""}],
    types: placeholder as Registry['admin.galerie']['types'],
  },
  'admin.donations': {
    methods: ["GET","HEAD"],
    pattern: '/admin/donations',
    tokens: [{"old":"/admin/donations","type":0,"val":"admin","end":""},{"old":"/admin/donations","type":0,"val":"donations","end":""}],
    types: placeholder as Registry['admin.donations']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
