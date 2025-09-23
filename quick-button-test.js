import puppeteer from 'puppeteer';

async function quickButtonTest() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('🚀 Quick button functionality test...');
    
    // Navigate to the live site
    await page.goto('https://beautylandcard.vip', { waitUntil: 'domcontentloaded', timeout: 10000 });
    
    // Check if language buttons exist and are clickable
    console.log('📝 Checking language buttons on home page...');
    
    const buttons = await page.$$eval('button', buttons => 
      buttons.map(btn => ({
        text: btn.textContent.trim(),
        disabled: btn.disabled,
        visible: btn.offsetParent !== null
      }))
    );
    
    console.log('Found buttons:', buttons);
    
    // Check for language buttons
    const languageButtons = buttons.filter(btn => 
      btn.text.includes('English') || 
      btn.text.includes('کوردی') || 
      btn.text.includes('العربية')
    );
    
    console.log('Language buttons found:', languageButtons);
    
    if (languageButtons.length > 0) {
      console.log('✅ Language buttons are present and appear functional');
      
      // Try clicking Kurdish button
      const kurdishClicked = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const kurdishBtn = buttons.find(btn => btn.textContent.includes('کوردی'));
        if (kurdishBtn && !kurdishBtn.disabled) {
          kurdishBtn.click();
          return true;
        }
        return false;
      });
      
      if (kurdishClicked) {
        console.log('✅ Kurdish button clicked successfully');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newUrl = page.url();
        console.log('New URL after click:', newUrl);
        
        if (newUrl.includes('/categories/ku')) {
          console.log('✅ Navigation to Kurdish categories successful');
        }
      }
    } else {
      console.log('❌ No language buttons found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

quickButtonTest();