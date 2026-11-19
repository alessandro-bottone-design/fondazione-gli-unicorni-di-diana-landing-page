import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// Keep in sync with src/content/index.ts for static HTML metadata.
const SITE_META = {
  name: 'Fondazione Gli Unicorni di Diana',
  description:
    'La Fondazione Gli Unicorni di Diana promuove la donazione di sangue e midollo osseo, a partire dalle scuole e dalle nuove generazioni.',
  telephone: '+393382974641',
  sameAs: [
    'https://www.instagram.com/gliunicornididiana/',
    'https://www.facebook.com/GliUnicorniDiDIANA/',
  ],
}

function resolveSiteUrl(env: Record<string, string | undefined>) {
  const raw = env.VITE_SITE_URL || env.VERCEL_PROJECT_PRODUCTION_URL || ''
  const trimmed = raw.trim().replace(/\/+$/, '')
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function seoMetaPlugin(siteUrl: string): Plugin {
  return {
    name: 'fondazione-seo-meta',
    transformIndexHtml(html) {
      const ogImage = siteUrl ? `${siteUrl}/media/og-cover.jpg` : '/media/og-cover.jpg'
      const extraHead: string[] = []

      if (siteUrl) {
        extraHead.push(
          `    <link rel="canonical" href="${siteUrl}/" />`,
          `    <meta property="og:url" content="${siteUrl}/" />`,
        )
      }

      const structuredData: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'NGO',
        name: SITE_META.name,
        description: SITE_META.description,
        telephone: SITE_META.telephone,
        sameAs: SITE_META.sameAs,
      }
      if (siteUrl) {
        structuredData.url = `${siteUrl}/`
        structuredData.logo = `${siteUrl}/media/marchio.webp`
        structuredData.image = ogImage
      }

      extraHead.push(
        `    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>`,
      )

      return html
        .replace('__OG_IMAGE__', ogImage)
        .replace('    <!-- __SEO_EXTRA__ -->', extraHead.join('\n'))
    },
    generateBundle() {
      if (!siteUrl) return
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          `    <loc>${siteUrl}/</loc>`,
          '    <changefreq>monthly</changefreq>',
          '    <priority>1.0</priority>',
          '  </url>',
          '</urlset>',
          '',
        ].join('\n'),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const siteUrl = resolveSiteUrl(env)

  return {
    plugins: [react(), tailwind(), seoMetaPlugin(siteUrl)],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  }
})
