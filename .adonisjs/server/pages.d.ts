import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'a-propos': ExtractProps<(typeof import('../../inertia/pages/a-propos.tsx'))['default']>
    'admin/agenda': ExtractProps<(typeof import('../../inertia/pages/admin/agenda.tsx'))['default']>
    'admin/dashboard': ExtractProps<(typeof import('../../inertia/pages/admin/dashboard.tsx'))['default']>
    'admin/evenements': ExtractProps<(typeof import('../../inertia/pages/admin/evenements.tsx'))['default']>
    'admin/galerie': ExtractProps<(typeof import('../../inertia/pages/admin/galerie.tsx'))['default']>
    'admin/medias': ExtractProps<(typeof import('../../inertia/pages/admin/medias.tsx'))['default']>
    'admin/membres': ExtractProps<(typeof import('../../inertia/pages/admin/membres.tsx'))['default']>
    'admin/ministeres': ExtractProps<(typeof import('../../inertia/pages/admin/ministeres.tsx'))['default']>
    'agenda': ExtractProps<(typeof import('../../inertia/pages/agenda.tsx'))['default']>
    'allContent': ExtractProps<(typeof import('../../inertia/pages/allContent.tsx'))['default']>
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'contact': ExtractProps<(typeof import('../../inertia/pages/contact.tsx'))['default']>
    'detail-activite': ExtractProps<(typeof import('../../inertia/pages/detail-activite.tsx'))['default']>
    'detail-evenement': ExtractProps<(typeof import('../../inertia/pages/detail-evenement.tsx'))['default']>
    'donation': ExtractProps<(typeof import('../../inertia/pages/donation.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'evenements': ExtractProps<(typeof import('../../inertia/pages/evenements.tsx'))['default']>
    'gallery': ExtractProps<(typeof import('../../inertia/pages/gallery.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'media': ExtractProps<(typeof import('../../inertia/pages/media.tsx'))['default']>
    'ministries': ExtractProps<(typeof import('../../inertia/pages/ministries.tsx'))['default']>
  }
}
