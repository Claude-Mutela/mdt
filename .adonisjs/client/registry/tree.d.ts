/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  apropos: typeof routes['apropos']
  media: typeof routes['media']
  gallery: typeof routes['gallery'] & {
    show: typeof routes['gallery.show']
  }
  allContent: typeof routes['allContent']
  ministries: typeof routes['ministries']
  ministeres: {
    show: typeof routes['ministeres.show']
  }
  evenements: typeof routes['evenements'] & {
    detail: typeof routes['evenements.detail']
  }
  agenda: typeof routes['agenda']
  cellules: typeof routes['cellules']
  contact: typeof routes['contact'] & {
    store: typeof routes['contact.store']
  }
  rendezVous: {
    index: typeof routes['rendez-vous.index']
    store: typeof routes['rendez-vous.store']
  }
  donation: typeof routes['donation']
  intercession: typeof routes['intercession']
  newsletter: {
    store: typeof routes['newsletter.store']
    confirm: typeof routes['newsletter.confirm']
  }
  login: typeof routes['login'] & {
    store: typeof routes['login.store']
  }
  auth: {
    verifyEmail: typeof routes['auth.verify_email']
  }
  logout: typeof routes['logout']
  admin: {
    dashboard: typeof routes['admin.dashboard']
    users: {
      index: typeof routes['admin.users.index']
      store: typeof routes['admin.users.store']
      update: typeof routes['admin.users.update']
      destroy: typeof routes['admin.users.destroy']
    }
    agenda: typeof routes['admin.agenda'] & {
      store: typeof routes['admin.agenda.store']
      update: typeof routes['admin.agenda.update']
      destroy: typeof routes['admin.agenda.destroy']
      categories: {
        store: typeof routes['admin.agenda.categories.store']
        update: typeof routes['admin.agenda.categories.update']
        destroy: typeof routes['admin.agenda.categories.destroy']
      }
    }
    assets: typeof routes['admin.assets'] & {
      store: typeof routes['admin.assets.store']
      activate: typeof routes['admin.assets.activate']
      deactivate: typeof routes['admin.assets.deactivate']
      destroy: typeof routes['admin.assets.destroy']
    }
    evenements: typeof routes['admin.evenements'] & {
      store: typeof routes['admin.evenements.store']
      update: typeof routes['admin.evenements.update']
      destroy: typeof routes['admin.evenements.destroy']
      categories: {
        store: typeof routes['admin.evenements.categories.store']
        update: typeof routes['admin.evenements.categories.update']
        destroy: typeof routes['admin.evenements.categories.destroy']
      }
    }
    medias: typeof routes['admin.medias'] & {
      store: typeof routes['admin.medias.store']
      update: typeof routes['admin.medias.update']
      destroy: typeof routes['admin.medias.destroy']
      categories: {
        store: typeof routes['admin.medias.categories.store']
        update: typeof routes['admin.medias.categories.update']
        destroy: typeof routes['admin.medias.categories.destroy']
      }
    }
    galerie: typeof routes['admin.galerie'] & {
      albums: {
        store: typeof routes['admin.galerie.albums.store']
        update: typeof routes['admin.galerie.albums.update']
        destroy: typeof routes['admin.galerie.albums.destroy']
      }
      photos: {
        store: typeof routes['admin.galerie.photos.store']
        update: typeof routes['admin.galerie.photos.update']
        destroy: typeof routes['admin.galerie.photos.destroy']
      }
      categories: {
        store: typeof routes['admin.galerie.categories.store']
        update: typeof routes['admin.galerie.categories.update']
        destroy: typeof routes['admin.galerie.categories.destroy']
      }
    }
    ministeres: typeof routes['admin.ministeres'] & {
      store: typeof routes['admin.ministeres.store']
      update: typeof routes['admin.ministeres.update']
      destroy: typeof routes['admin.ministeres.destroy']
    }
    cellules: typeof routes['admin.cellules'] & {
      responsables: typeof routes['admin.cellules.responsables']
      store: typeof routes['admin.cellules.store']
      update: typeof routes['admin.cellules.update']
      destroy: typeof routes['admin.cellules.destroy']
    }
    newsletter: typeof routes['admin.newsletter'] & {
      destroy: typeof routes['admin.newsletter.destroy']
    }
    membres: typeof routes['admin.membres'] & {
      print: typeof routes['admin.membres.print']
    }
    members: {
      store: typeof routes['admin.members.store']
      update: typeof routes['admin.members.update']
      destroy: typeof routes['admin.members.destroy']
    }
    rendezVous: typeof routes['admin.rendez-vous'] & {
      print: typeof routes['admin.rendez-vous.print']
      update: typeof routes['admin.rendez-vous.update']
      reschedule: typeof routes['admin.rendez-vous.reschedule']
      destroy: typeof routes['admin.rendez-vous.destroy']
    }
    nouveauxVenus: typeof routes['admin.nouveaux_venus'] & {
      print: typeof routes['admin.nouveaux_venus.print']
    }
    newcomers: {
      store: typeof routes['admin.newcomers.store']
      update: typeof routes['admin.newcomers.update']
      destroy: typeof routes['admin.newcomers.destroy']
    }
    finances: typeof routes['admin.finances'] & {
      operations: {
        store: typeof routes['admin.finances.operations.store']
        update: typeof routes['admin.finances.operations.update']
        destroy: typeof routes['admin.finances.operations.destroy']
      }
      categories: {
        store: typeof routes['admin.finances.categories.store']
        update: typeof routes['admin.finances.categories.update']
        destroy: typeof routes['admin.finances.categories.destroy']
      }
      rates: {
        update: typeof routes['admin.finances.rates.update']
      }
    }
    donations: typeof routes['admin.donations']
  }
}
