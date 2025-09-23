import puppeteer from 'puppeteer';

async function testLanguageSwitching() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Testing language switching functionality...');
    
    // Navigate to the live site
    await page.goto('https://beautylandcard.vip', { waitUntil: 'networkidle0' });
    
    // Test 1: Click Kurdish language button from home page
    console.log('📝 Test 1: Clicking Kurdish language button...');
    await page.waitForSelector('button', { timeout: 5000 });
    
    // Find and click the Kurdish button
    const kurdishButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('کوردی'));
    });
    
    if (kurdishButton.asElement()) {
      await kurdishButton.asElement().click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      // Check if we're on the Kurdish categories page
      const currentUrl = page.url();
      console.log('✅ Current URL after Kurdish click:', currentUrl);
      
      if (currentUrl.includes('/categories/ku')) {
        console.log('✅ Successfully navigated to Kurdish categories page');
      } else {
        console.log('❌ Failed to navigate to Kurdish categories page');
      }
    }
    
    // Test 2: Click on a clinic to go to menu page
    console.log('📝 Test 2: Clicking on a clinic card...');
    await page.waitForSelector('[aria-label*="Open"]', { timeout: 5000 });
    const clinicCard = await page.$('[aria-label*="Open"]');
    
    if (clinicCard) {
      await clinicCard.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      const menuUrl = page.url();
      console.log('✅ Current URL after clinic click:', menuUrl);
      
      if (menuUrl.includes('/menu/ku')) {
        console.log('✅ Successfully navigated to Kurdish menu page');
      } else {
        console.log('❌ Failed to navigate to Kurdish menu page');
      }
    }
    
    // Test 3: Test language switching in menu page
    console.log('📝 Test 3: Testing language switcher in menu page...');
    await page.waitForSelector('button[aria-label="Open language menu"]', { timeout: 5000 });
    
    // Click language menu button
    await page.click('button[aria-label="Open language menu"]');
    await page.waitForTimeout(500);
    
    // Click English option
    const englishOption = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('English'));
    });
    
    if (englishOption.asElement()) {
      await englishOption.asElement().click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      const englishUrl = page.url();
      console.log('✅ Current URL after English switch:', englishUrl);
      
      if (englishUrl.includes('/menu/en') && englishUrl.includes('clinic=')) {
        console.log('✅ Successfully switched to English while preserving clinic parameter');
      } else {
        console.log('❌ Failed to switch to English or lost clinic parameter');
      }
    }
    
    // Test 4: Test language switching in categories page
    console.log('📝 Test 4: Testing language switcher in categories page...');
    await page.goto('https://beautylandcard.vip/categories/en', { waitUntil: 'networkidle0' });
    
    await page.waitForSelector('button[aria-label="Open language menu"]', { timeout: 5000 });
    
    // Click language menu button
    await page.click('button[aria-label="Open language menu"]');
    await page.waitForTimeout(500);
    
    // Click Arabic option
    const arabicOption = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn => btn.textContent.includes('العربيه'));
    });
    
    if (arabicOption.asElement()) {
      await arabicOption.asElement().click();
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      
      const arabicUrl = page.url();
      console.log('✅ Current URL after Arabic switch:', arabicUrl);
      
      if (arabicUrl.includes('/categories/ar')) {
        console.log('✅ Successfully switched to Arabic in categories page');
      } else {
        console.log('❌ Failed to switch to Arabic in categories page');
      }
    }
    
    console.log('🎉 Language switching tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testLanguageSwitching();