/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  apropos: typeof routes['apropos']
  media: typeof routes['media']
  gallery: typeof routes['gallery']
  allContent: typeof routes['allContent']
  ministries: typeof routes['ministries']
  activites: {
    detail: typeof routes['activites.detail']
  }
  evenements: typeof routes['evenements'] & {
    detail: typeof routes['evenements.detail']
  }
  agenda: typeof routes['agenda']
  contact: typeof routes['contact']
  donation: typeof routes['donation']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  admin: {
    dashboard: typeof routes['admin.dashboard']
    membres: typeof routes['admin.membres']
    agenda: typeof routes['admin.agenda']
    ministeres: typeof routes['admin.ministeres']
    evenements: typeof routes['admin.evenements']
    medias: typeof routes['admin.medias']
    galerie: typeof routes['admin.galerie']
    donations: typeof routes['admin.donations']
  }
}
