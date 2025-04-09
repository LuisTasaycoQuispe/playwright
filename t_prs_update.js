const { chromium } = require('playwright');

(async () => {
  const browserNames = ['chromium'];
  for (let i = 0; i < browserNames.length; i++) {
    let page;
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        slowMo: 50,
      });

      const context = await browser.newContext({
        recordVideo: { dir: `./videos/${browserNames[i]}/` },
        screenshot: 'only-on-failure',
      });

      page = await context.newPage();

      console.log(`Probando en ${browserNames[i]}...`);

      await page.goto('https://shiny-parakeet-6jgr9q9jj74h5p6-4200.app.github.dev/dashboard/beneficiarios');
      await page.waitForLoadState('domcontentloaded'); 

      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(15000); 
      await page.click('#btn_detalles_table');

      await page.waitForTimeout(15000);
      await page.waitForSelector('#btn_datos_personales', { state: 'visible', timeout: 60000 });

      await page.click('#btn_datos_personales');  

      console.log('Se hizo clic en el botón exitosamente.');
      await page.waitForTimeout(8000);
      await page.waitForSelector('input[name="name"]', { state: 'visible' });
      await page.fill('input[name="name"]', 'Luis 2');
      await page.fill('input[name="surname"]', 'Tasayco 2');
      await page.fill('input[name="age"]', '19');
      await page.fill('input[name="birthdate"]', '2005-11-22'); 
      await page.fill('input[name="documentNumber"]', '72847110');

      await page.waitForTimeout(5000);
      

      console.log("Datos rellenados.");
      await page.click('button[type="submit"]');

      await page.waitForTimeout(15000);

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
