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
import { trackPageView } from '~/utils/analytics'

// Suivi des pages vues pour Google Analytics 4 (SPA Inertia)
// Le flag __inertiaHasNavigated empêche le double Page View avec le onload de gtag.js
router.on('navigate', (event) => {
  if (typeof window !== 'undefined') {
    window.__inertiaHasNavigated = true
    trackPageView(event.detail.page.url, document.title)
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
