import { Edge } from 'edge.js'
import fs from 'fs'

const edge = Edge.create()

// Simulation du cas VPS où appUrl vaut http://127.0.0.1:3333
const layoutContent = fs.readFileSync('resources/views/inertia_layout.edge', 'utf-8')

edge.registerTemplate('inertia_layout', {
  template: layoutContent,
})

const html = edge.renderSync('inertia_layout', {
  canonicalUrl: 'http://127.0.0.1:3333/',
  appUrl: 'http://127.0.0.1:3333',
  page: {
    component: 'home',
    props: {},
  },
})

console.log('--- RENDU EN PRODUCTION QUAND APP_URL = 127.0.0.1 ---')
console.log('Canonical link:', html.match(/<link rel="canonical" href="([^"]+)"/)?.[1])
console.log('og:url:', html.match(/<meta property="og:url" content="([^"]+)"/)?.[1])
console.log('og:image:', html.match(/<meta property="og:image" content="([^"]+)"/)?.[1])
