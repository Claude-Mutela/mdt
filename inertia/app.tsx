import './css/app.css'
import { ReactElement } from 'react'
import { client } from './client'
import Layout from '~/layouts/default'
import SplashLoader from '~/components/SplashLoader'
import { Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp, router } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

// Suivi des pages vues pour Google Tag Manager / Google Analytics (SPA Inertia)
router.on('navigate', (event) => {
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    ;(window as any).dataLayer.push({
      event: 'page_view',
      page_path: event.detail.page.url,
      page_title: document.title,
    })
  }
})

const appName = import.meta.env.VITE_APP_NAME || 'Phila MDT'

createInertiaApp({
  title: (title) => title || appName,
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) =>
        name.startsWith('admin/') || name.startsWith('auth/') ? page : <Layout children={page} />
    )
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <TuyauProvider client={client}>
        <SplashLoader />
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: false,
})
