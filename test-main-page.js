import puppeteer from 'puppeteer';

async function testMainPage() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  
  try {
    await page.goto('https://beautylandcard.vip', { waitUntil: 'networkidle0' });
    
    // Check if buttons exist
    const buttons = await page.$$eval('button', btns => 
      btns.map(btn => ({ text: btn.textContent, disabled: btn.disabled }))
    );
    console.log('Buttons found:', buttons);
    
    // Try clicking Kurdish button
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('کوردی'));
      if (btn) {
        console.log('Clicking Kurdish button...');
        btn.click();
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('URL after click:', page.url());
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
}

testMainPage();