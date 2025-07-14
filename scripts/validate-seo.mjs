#!/usr/bin/env node

/**
 * SEO Validation Script
 * Validates SEO implementation and provides recommendations
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, '../public')
const srcDir = path.join(__dirname, '../src')

// Check if essential SEO files exist
function checkEssentialFiles() {
  const essentialFiles = [
    'robots.txt',
    'sitemap.xml',
    'favicon.ico',
    'og-image.png'
  ]

  console.log('🔍 Checking essential SEO files...')
  
  const results = essentialFiles.map(file => {
    const filePath = path.join(publicDir, file)
    const exists = fs.existsSync(filePath)
    console.log(`${exists ? '✅' : '❌'} ${file}`)
    return { file, exists }
  })

  return results.every(r => r.exists)
}

// Validate Open Graph image dimensions
function validateOGImage() {
  console.log('\n🖼️  Validating Open Graph image...')
  
  const ogImagePath = path.join(publicDir, 'og-image.png')
  if (!fs.existsSync(ogImagePath)) {
    console.log('❌ og-image.png not found')
    return false
  }

  // Note: In a real implementation, you would use an image processing library
  // to check dimensions. For now, we'll just check if the file exists.
  console.log('✅ og-image.png exists')
  console.log('💡 Recommended: 1200x630px for optimal social media display')
  
  return true
}

// Check for SEO components in React files
function checkSEOImplementation() {
  console.log('\n⚛️  Checking SEO component implementation...')
  
  const seoComponentPath = path.join(srcDir, 'components', 'SEO.tsx')
  const structuredDataPath = path.join(srcDir, 'components', 'StructuredData.tsx')
  
  const seoExists = fs.existsSync(seoComponentPath)
  const structuredDataExists = fs.existsSync(structuredDataPath)
  
  console.log(`${seoExists ? '✅' : '❌'} SEO component`)
  console.log(`${structuredDataExists ? '✅' : '❌'} StructuredData component`)
  
  return seoExists && structuredDataExists
}

// Validate meta tag implementation in pages
function checkPageImplementation() {
  console.log('\n📄 Checking page SEO implementation...')
  
  const pagesToCheck = [
    'pages/Index.tsx',
    'pages/LandingPage.tsx',
    'pages/NotFound.tsx',
    'components/Auth/AuthPage.tsx'
  ]
  
  const results = pagesToCheck.map(pagePath => {
    const fullPath = path.join(srcDir, pagePath)
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ ${pagePath} - File not found`)
      return false
    }
    
    const content = fs.readFileSync(fullPath, 'utf8')
    const hasSEOImport = content.includes('import { SEO')
    const hasSEOComponent = content.includes('<SEO ')
    
    const status = hasSEOImport && hasSEOComponent
    console.log(`${status ? '✅' : '❌'} ${pagePath}`)
    
    return status
  })
  
  return results.every(r => r)
}

// Generate SEO recommendations
function generateRecommendations() {
  console.log('\n💡 SEO Recommendations:')
  
  const recommendations = [
    'Test your pages with Google\'s Rich Results Test',
    'Submit your sitemap to Google Search Console',
    'Set up Google Analytics for traffic monitoring',
    'Test social media previews with Facebook Debugger',
    'Monitor Core Web Vitals in PageSpeed Insights',
    'Ensure all images have descriptive alt text',
    'Implement proper heading hierarchy (H1, H2, H3)',
    'Add internal linking between related pages',
    'Optimize images with WebP format when possible',
    'Set up proper canonical URLs for all pages'
  ]
  
  recommendations.forEach((rec, index) => {
    console.log(`   ${index + 1}. ${rec}`)
  })
}

// Generate validation report
function generateValidationReport() {
  const report = {
    validatedAt: new Date().toISOString(),
    checks: {
      essentialFiles: checkEssentialFiles(),
      ogImage: validateOGImage(),
      seoComponents: checkSEOImplementation(),
      pageImplementation: checkPageImplementation()
    },
    score: 0
  }
  
  // Calculate score
  const totalChecks = Object.keys(report.checks).length
  const passedChecks = Object.values(report.checks).filter(Boolean).length
  report.score = Math.round((passedChecks / totalChecks) * 100)
  
  console.log(`\n📊 SEO Implementation Score: ${report.score}%`)
  
  if (report.score === 100) {
    console.log('🎉 Perfect! Your SEO implementation is complete.')
  } else if (report.score >= 75) {
    console.log('👍 Good! Your SEO implementation is mostly complete.')
  } else if (report.score >= 50) {
    console.log('⚠️  Fair. Your SEO implementation needs improvement.')
  } else {
    console.log('❌ Poor. Your SEO implementation needs significant work.')
  }
  
  // Save report
  const reportPath = path.join(publicDir, 'seo-validation-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📋 Validation report saved: ${reportPath}`)
  
  return report
}

// Main execution
function main() {
  console.log('🔍 Starting SEO validation...\n')
  
  const report = generateValidationReport()
  generateRecommendations()
  
  console.log('\n✨ SEO validation complete!')
  
  // Exit with error code if score is too low
  if (report.score < 75) {
    process.exit(1)
  }
}

main()
