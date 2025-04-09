const { chromium, firefox, webkit } = require('playwright');

(async () => {
  const browsers = [chromium, firefox, webkit];
  const browserNames = ['chromium', 'firefox', 'webkit'];

  for (let i = 0; i < browsers.length; i++) {
    let page;
    let browser;
    try {
      browser = await browsers[i].launch({
        headless: true,
        slowMo: 50, 
      });

      const context = await browser.newContext({
        recordVideo: { dir: `./videos/${browserNames[i]}/` },
        screenshot: 'only-on-failure',
      });

      page = await context.newPage();

      console.log(`Probando en ${browserNames[i]}...`);

      await page.goto('https://site.q10.com/');
      await page.waitForLoadState('domcontentloaded'); 

      await page.waitForTimeout(3000); 

  
      await page.fill('input[name="NombreUsuario"]', process.env.USER);
      await page.waitForTimeout(4000); 

      await page.fill('input[name="Contrasena"]', process.env.PASSWORD);

      await page.waitForTimeout(4000); 

      await page.click('button[type="submit"]');
      await page.waitForTimeout(30000); 


      console.log(`Registro exitoso en ${browserNames[i]}!`);

    } catch (error) {
      console.error(`Error en ${browserNames[i]}: ${error.message}`);
      if (page) {
        await page.screenshot({ path: `./errors/${browserNames[i]}-error.png` });
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
})();