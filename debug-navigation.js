import puppeteer from 'puppeteer';

async function debugNavigation() {
  const browser = await puppeteer.launch({ headless: false, devtools: true });
  const page = await browser.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.type(), msg.text());
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  try {
    console.log('🚀 Debugging navigation...');
    
    await page.goto('https://beautylandcard.vip', { waitUntil: 'networkidle0' });
    
    console.log('📝 Current URL:', page.url());
    
    // Check if React Router is working
    const reactRouterCheck = await page.evaluate(() => {
      return {
        hasReactRouter: !!window.history.pushState,
        currentPath: window.location.pathname,
        localStorage: localStorage.getItem('selectedLanguage')
      };
    });
    
    console.log('React Router check:', reactRouterCheck);
    
    // Try clicking Kurdish button and monitor what happens
    console.log('📝 Clicking Kurdish button...');
    
    const clickResult = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const kurdishBtn = buttons.find(btn => btn.textContent.includes('کوردی'));
      
      if (kurdishBtn) {
        console.log('Found Kurdish button, clicking...');
        kurdishBtn.click();
        return {
          clicked: true,
          buttonText: kurdishBtn.textContent,
          hasOnClick: !!kurdishBtn.onclick
        };
      }
      return { clicked: false };
    });
    
    console.log('Click result:', clickResult);
    
    // Wait a bit and check URL again
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('📝 URL after click:', page.url());
    
    // Check localStorage
    const storageCheck = await page.evaluate(() => {
      return {
        selectedLanguage: localStorage.getItem('selectedLanguage'),
        allStorage: Object.keys(localStorage).map(key => ({
          key,
          value: localStorage.getItem(key)
        }))
      };
    });
    
    console.log('Storage check:', storageCheck);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
  
  // Keep browser open for manual inspection
  console.log('Browser will stay open for manual inspection...');
  await new Promise(resolve => setTimeout(resolve, 30000));
  await browser.close();
}

debugNavigation();