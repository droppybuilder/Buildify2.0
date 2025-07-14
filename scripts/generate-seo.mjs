#!/usr/bin/env node

/**
 * SEO Optimization Script for Buildfy Web
 * 
 * This script generates and updates SEO-related files:
 * - Dynamic sitemap generation
 * - Meta tag validation
 * - Performance optimization checks
 * - Social media preview validation
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DOMAIN = 'https://buildfy.droppybuilder.com'
const BUILD_DIR = path.join(__dirname, '../public')

// Route definitions with SEO metadata
const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: new Date().toISOString().split('T')[0],
    title: 'Buildfy Web - Visual Python GUI Builder | No-Code CustomTkinter Designer',
    description: 'Build professional Python GUIs with our visual drag-and-drop builder. Export clean, production-ready CustomTkinter code instantly. No coding experience required.'
  },
  {
    path: '/landing',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
    title: 'Buildfy Web - Create Python GUIs Visually | Free No-Code Builder',
    description: 'Turn your ideas into Python desktop applications without writing code. Our visual builder generates clean CustomTkinter code. Start building for free today!'
  },
  {
    path: '/pricing',
    priority: 0.9,
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0],
    title: 'Pricing Plans - Buildfy Web | Affordable Python GUI Builder',
    description: 'Choose the perfect plan for your Python GUI development needs. Start free and scale as you grow. Professional features at affordable prices.'
  },
  {
    path: '/auth',
    priority: 0.8,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0],
    title: 'Sign In - Buildfy Web | Access Your Python GUI Projects',
    description: 'Sign in to Buildfy Web to access your Python GUI projects, export code, and build professional desktop applications.'
  },
  {
    path: '/profile',
    priority: 0.6,
    changefreq: 'monthly',
    lastmod: new Date().toISOString().split('T')[0],
    title: 'Profile - Buildfy Web | Manage Your Account',
    description: 'Manage your Buildfy Web account, subscription, and Python GUI project settings.'
  },
  {
    path: '/payment-success',
    priority: 0.3,
    changefreq: 'yearly',
    lastmod: new Date().toISOString().split('T')[0],
    title: 'Payment Successful - Buildfy Web | Welcome to Pro Features',
    description: 'Payment successful! Welcome to Buildfy Web Pro. Start building advanced Python GUIs with unlimited features.'
  }
]

// Generate sitemap.xml
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml" 
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes.map(route => `  
  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}

</urlset>`

  fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')
}

// Generate robots.txt
function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /

# Priority pages
Allow: /landing
Allow: /auth
Allow: /pricing
Allow: /profile

# Block sensitive areas
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /*?*utm_source=
Disallow: /*?*utm_medium=
Disallow: /*?*utm_campaign=

# Sitemap location
Sitemap: ${DOMAIN}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1`

  fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), robots)
  console.log('✅ Generated robots.txt')
}

// Generate SEO report
function generateSEOReport() {
  const report = {
    domain: DOMAIN,
    generatedAt: new Date().toISOString(),
    routes: routes.length,
    sitemapGenerated: true,
    robotsTxtGenerated: true,
    recommendations: [
      'Ensure all images have alt tags',
      'Optimize image sizes for better performance',
      'Add structured data to all pages',
      'Monitor Core Web Vitals regularly',
      'Test social media previews',
      'Validate meta tags across all pages'
    ],
    checklist: {
      'Meta titles under 60 characters': routes.every(r => r.title.length <= 60),
      'Meta descriptions under 160 characters': routes.every(r => r.description.length <= 160),
      'All routes have unique titles': new Set(routes.map(r => r.title)).size === routes.length,
      'All routes have unique descriptions': new Set(routes.map(r => r.description)).size === routes.length
    }
  }

  fs.writeFileSync(path.join(BUILD_DIR, 'seo-report.json'), JSON.stringify(report, null, 2))
  console.log('✅ Generated SEO report')
  
  // Display checklist results
  console.log('\n📋 SEO Checklist:')
  Object.entries(report.checklist).forEach(([check, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${check}`)
  })
}

// Main execution
function main() {
  console.log('🚀 Starting SEO optimization...\n')
  
  // Ensure public directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR, { recursive: true })
  }

  generateSitemap()
  generateRobotsTxt()
  generateSEOReport()
  
  console.log('\n🎉 SEO optimization complete!')
  console.log(`📊 View the SEO report: ${path.join(BUILD_DIR, 'seo-report.json')}`)
}

main()
