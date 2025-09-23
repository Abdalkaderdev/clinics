// Run: npm install puppeteer
// Then: node test-live-site.js
import puppeteer from 'puppeteer';

const BASE_URL = 'https://beautylandcard.vip';
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(test, status, message = '') {
  const result = { test, status, message };
  results.tests.push(result);
  if (status === 'PASS') results.passed++;
  else results.failed++;
  console.log(`${status === 'PASS' ? '✅' : '❌'} ${test}: ${message}`);
}

async function testSite() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  try {
    // Test 1: Homepage loads with 200 status
    const response = await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    log('Homepage Load', response.status() === 200 ? 'PASS' : 'FAIL', `Status: ${response.status()}`);

    // Test 2: Check major routes (based on actual app structure)
    const routes = ['/categories/en', '/menu/en'];
    for (const route of routes) {
      try {
        const routeResponse = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
        log(`Route ${route}`, routeResponse.status() === 200 ? 'PASS' : 'FAIL', `Status: ${routeResponse.status()}`);
      } catch (error) {
        log(`Route ${route}`, 'FAIL', error.message);
      }
    }

    // Test 3: Check images load
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const images = await page.$$eval('img', imgs => 
      imgs.map(img => ({ src: img.src, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight }))
    );
    
    const brokenImages = images.filter(img => img.naturalWidth === 0 || img.naturalHeight === 0);
    log('Image Loading', brokenImages.length === 0 ? 'PASS' : 'FAIL', 
      brokenImages.length > 0 ? `${brokenImages.length} broken images` : `${images.length} images loaded`);

    // Test 4: Language switching
    await page.goto(`${BASE_URL}/categories/en`, { waitUntil: 'networkidle0' });
    const englishContent = await page.$eval('body', el => el.textContent).catch(() => '');
    
    await page.goto(`${BASE_URL}/categories/ar`, { waitUntil: 'networkidle0' });
    const arabicContent = await page.$eval('body', el => el.textContent).catch(() => '');
    
    const contentDifferent = englishContent !== arabicContent && arabicContent.length > 0;
    log('Language Switching', contentDifferent ? 'PASS' : 'FAIL', 
      contentDifferent ? 'Content changes between languages' : 'No language difference detected');

    // Test 5: Console errors
    log('Console Errors', consoleErrors.length === 0 ? 'PASS' : 'FAIL', 
      consoleErrors.length > 0 ? `${consoleErrors.length} errors: ${consoleErrors.slice(0, 3).join(', ')}` : 'No console errors');

  } catch (error) {
    log('General Test', 'FAIL', error.message);
  } finally {
    await browser.close();
  }

  // Summary Report
  console.log('\n📊 SUMMARY REPORT');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('\nSite Status:', results.failed === 0 ? '🟢 FULLY FUNCTIONAL' : '🟡 ISSUES DETECTED');
}

testSite().catch(console.error);