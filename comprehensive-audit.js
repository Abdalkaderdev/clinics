// Run: npm install puppeteer lighthouse chrome-launcher axios cheerio
// Then: node comprehensive-audit.js
import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const URL = 'https://beautylandcard.vip';
const routes = ['/', '/categories/en', '/menu/en', '/categories/ar', '/menu/ar'];

const auditResults = {
  timestamp: new Date().toISOString(),
  url: URL,
  routes: [],
  images: [],
  console: [],
  lighthouse: {},
  summary: {}
};

// 1. Route & Asset Check
async function checkRoutes() {
  console.log('🔍 1/3 Checking routes and assets...');
  
  for (const route of routes) {
    try {
      const response = await axios.get(`${URL}${route}`, { timeout: 10000 });
      const routeResult = {
        path: route,
        status: response.status,
        success: response.status === 200
      };
      auditResults.routes.push(routeResult);

      // Check images in this route
      const $ = cheerio.load(response.data);
      const images = $('img');
      
      for (let i = 0; i < images.length; i++) {
        const img = $(images[i]);
        let src = img.attr('src');
        if (!src) continue;
        
        if (src.startsWith('/')) src = URL + src;
        else if (!src.startsWith('http')) src = URL + '/' + src;

        try {
          const imgResponse = await axios.head(src, { timeout: 5000 });
          auditResults.images.push({
            route,
            src,
            status: imgResponse.status,
            success: imgResponse.status === 200
          });
        } catch (error) {
          auditResults.images.push({
            route,
            src,
            status: 'ERROR',
            success: false,
            error: error.message
          });
        }
      }
    } catch (error) {
      auditResults.routes.push({
        path: route,
        status: 'ERROR',
        success: false,
        error: error.message
      });
    }
  }
}

// 2. Puppeteer Console Check
async function checkConsole() {
  console.log('🖥️  2/3 Checking console errors...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      auditResults.console.push({
        type: 'error',
        text: msg.text(),
        url: page.url()
      });
    }
  });

  try {
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await page.goto(`${URL}/categories/en`, { waitUntil: 'networkidle0' });
    await page.goto(`${URL}/menu/en`, { waitUntil: 'networkidle0' });
  } catch (error) {
    auditResults.console.push({
      type: 'navigation-error',
      text: error.message,
      url: URL
    });
  }
  
  await browser.close();
}

// 3. Lighthouse Audit
async function runLighthouse() {
  console.log('🚀 3/3 Running Lighthouse audit...');
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  try {
    const options = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
    };

    const runnerResult = await lighthouse(URL, options);
    const { categories } = runnerResult.lhr;
    
    auditResults.lighthouse = {
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
      overall: Math.round((
        categories.performance.score +
        categories.accessibility.score +
        categories['best-practices'].score +
        categories.seo.score
      ) / 4 * 100)
    };
  } catch (error) {
    auditResults.lighthouse = { error: error.message };
  } finally {
    await chrome.kill();
  }
}

// Generate Summary
function generateSummary() {
  const routesPassed = auditResults.routes.filter(r => r.success).length;
  const imagesPassed = auditResults.images.filter(i => i.success).length;
  
  auditResults.summary = {
    routes: {
      total: auditResults.routes.length,
      passed: routesPassed,
      failed: auditResults.routes.length - routesPassed,
      successRate: Math.round((routesPassed / auditResults.routes.length) * 100)
    },
    images: {
      total: auditResults.images.length,
      passed: imagesPassed,
      failed: auditResults.images.length - imagesPassed,
      successRate: auditResults.images.length > 0 ? Math.round((imagesPassed / auditResults.images.length) * 100) : 100
    },
    console: {
      errors: auditResults.console.length,
      clean: auditResults.console.length === 0
    },
    lighthouse: auditResults.lighthouse,
    overallStatus: getOverallStatus()
  };
}

function getOverallStatus() {
  const routesOk = auditResults.summary?.routes?.successRate === 100;
  const imagesOk = auditResults.summary?.images?.successRate === 100;
  const consoleOk = auditResults.console.length === 0;
  const lighthouseOk = auditResults.lighthouse.overall >= 90;
  
  if (routesOk && imagesOk && consoleOk && lighthouseOk) return '🟢 EXCELLENT';
  if (routesOk && imagesOk && consoleOk) return '🟡 GOOD';
  return '🔴 NEEDS ATTENTION';
}

// Save Reports
function saveReports() {
  // Save JSON report
  fs.writeFileSync('audit-report.json', JSON.stringify(auditResults, null, 2));
  
  // Generate HTML report
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Site Audit Report - ${new Date().toLocaleDateString()}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { color: #059669; } .error { color: #dc2626; } .warning { color: #d97706; }
        .score { font-size: 24px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Comprehensive Site Audit</h1>
            <p><strong>URL:</strong> ${URL}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <h2 class="score ${auditResults.summary.overallStatus.includes('🟢') ? 'success' : auditResults.summary.overallStatus.includes('🟡') ? 'warning' : 'error'}">${auditResults.summary.overallStatus}</h2>
        </div>

        <div class="section">
            <h3>📊 Summary</h3>
            <p><strong>Routes:</strong> ${auditResults.summary.routes.passed}/${auditResults.summary.routes.total} passed (${auditResults.summary.routes.successRate}%)</p>
            <p><strong>Images:</strong> ${auditResults.summary.images.passed}/${auditResults.summary.images.total} loaded (${auditResults.summary.images.successRate}%)</p>
            <p><strong>Console:</strong> ${auditResults.console.length} errors</p>
            <p><strong>Lighthouse:</strong> ${auditResults.lighthouse.overall}/100 overall</p>
        </div>

        <div class="section">
            <h3>🚀 Lighthouse Scores</h3>
            <p>Performance: <span class="score">${auditResults.lighthouse.performance}/100</span></p>
            <p>Accessibility: <span class="score">${auditResults.lighthouse.accessibility}/100</span></p>
            <p>Best Practices: <span class="score">${auditResults.lighthouse.bestPractices}/100</span></p>
            <p>SEO: <span class="score">${auditResults.lighthouse.seo}/100</span></p>
        </div>

        <div class="section">
            <h3>🔗 Route Status</h3>
            <table>
                <tr><th>Route</th><th>Status</th><th>Result</th></tr>
                ${auditResults.routes.map(r => `
                    <tr>
                        <td>${r.path}</td>
                        <td>${r.status}</td>
                        <td class="${r.success ? 'success' : 'error'}">${r.success ? '✅ Pass' : '❌ Fail'}</td>
                    </tr>
                `).join('')}
            </table>
        </div>

        ${auditResults.console.length > 0 ? `
        <div class="section">
            <h3>🖥️ Console Errors</h3>
            ${auditResults.console.map(c => `<p class="error">❌ ${c.text}</p>`).join('')}
        </div>
        ` : '<div class="section"><h3>🖥️ Console</h3><p class="success">✅ No console errors</p></div>'}
    </div>
</body>
</html>`;
  
  fs.writeFileSync('audit-report.html', html);
}

// Main execution
async function runComprehensiveAudit() {
  console.log('🔍 Starting comprehensive site audit...\n');
  
  try {
    await checkRoutes();
    await checkConsole();
    await runLighthouse();
    
    generateSummary();
    saveReports();
    
    // Console output
    console.log('\n📊 COMPREHENSIVE AUDIT COMPLETE');
    console.log('='.repeat(50));
    console.log(`🔗 Routes: ${auditResults.summary.routes.passed}/${auditResults.summary.routes.total} (${auditResults.summary.routes.successRate}%)`);
    console.log(`🖼️  Images: ${auditResults.summary.images.passed}/${auditResults.summary.images.total} (${auditResults.summary.images.successRate}%)`);
    console.log(`🖥️  Console: ${auditResults.console.length} errors`);
    console.log(`🚀 Lighthouse: ${auditResults.lighthouse.overall}/100`);
    console.log(`📈 Status: ${auditResults.summary.overallStatus}`);
    console.log('\n📄 Reports saved:');
    console.log('   - audit-report.json (detailed data)');
    console.log('   - audit-report.html (visual report)');
    
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
  }
}

runComprehensiveAudit();