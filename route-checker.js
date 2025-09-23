// Run: npm install axios cheerio
// Then: node route-checker.js
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://beautylandcard.vip';
const routes = ['/', '/categories/en', '/menu/en', '/categories/ar', '/menu/ar'];

const results = {
  passed: 0,
  failed: 0,
  routes: [],
  brokenImages: []
};

async function checkRoute(route) {
  try {
    const response = await axios.get(`${BASE_URL}${route}`, { timeout: 10000 });
    const status = response.status === 200 ? 'PASS' : 'FAIL';
    
    results.routes.push({
      route,
      status: response.status,
      result: status
    });

    if (status === 'PASS') {
      results.passed++;
      await checkImages(response.data, route);
    } else {
      results.failed++;
    }

    console.log(`${status === 'PASS' ? '✅' : '❌'} ${route}: ${response.status}`);
    
  } catch (error) {
    results.failed++;
    results.routes.push({
      route,
      status: 'ERROR',
      result: 'FAIL',
      error: error.message
    });
    console.log(`❌ ${route}: ERROR - ${error.message}`);
  }
}

async function checkImages(html, route) {
  const $ = cheerio.load(html);
  const images = $('img');
  
  for (let i = 0; i < images.length; i++) {
    const img = $(images[i]);
    let src = img.attr('src');
    
    if (!src) continue;
    
    // Convert relative URLs to absolute
    if (src.startsWith('/')) {
      src = BASE_URL + src;
    } else if (!src.startsWith('http')) {
      src = BASE_URL + '/' + src;
    }

    try {
      const response = await axios.head(src, { timeout: 5000 });
      if (response.status !== 200) {
        results.brokenImages.push({ route, src, status: response.status });
      }
    } catch (error) {
      results.brokenImages.push({ 
        route, 
        src, 
        status: 'ERROR', 
        error: error.message 
      });
    }
  }
}

async function runCheck() {
  console.log('🔍 Checking site routes and assets...\n');
  
  for (const route of routes) {
    await checkRoute(route);
  }

  // Report
  console.log('\n📊 ROUTE CHECK REPORT');
  console.log('='.repeat(50));
  console.log(`✅ Routes Passed: ${results.passed}`);
  console.log(`❌ Routes Failed: ${results.failed}`);
  
  if (results.brokenImages.length > 0) {
    console.log(`\n🖼️  BROKEN IMAGES (${results.brokenImages.length}):`);
    results.brokenImages.forEach(img => {
      console.log(`❌ ${img.route}: ${img.src} (${img.status})`);
    });
  } else {
    console.log('\n✅ All images loading correctly');
  }

  // Failed routes details
  const failedRoutes = results.routes.filter(r => r.result === 'FAIL');
  if (failedRoutes.length > 0) {
    console.log('\n❌ FAILED ROUTES:');
    failedRoutes.forEach(route => {
      console.log(`   ${route.route}: ${route.status} ${route.error || ''}`);
    });
  }

  const successRate = Math.round((results.passed / (results.passed + results.failed)) * 100);
  console.log(`\n🎯 Success Rate: ${successRate}%`);
  console.log(`📈 Site Status: ${successRate === 100 && results.brokenImages.length === 0 ? '🟢 PERFECT' : successRate >= 80 ? '🟡 GOOD' : '🔴 ISSUES'}`);
}

runCheck().catch(console.error);