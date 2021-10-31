const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // default is true
  const page = await browser.newPage();
  await page.setViewport({
  	width: 1024,
	height:960,
	deviceScaleFactor: 1,
	});

// open page and search for "tiger"
  await page.goto('https://animalskinsandbones.com/');
  await page.type('input[name=s]', 'tiger');
  await page.keyboard.press('\n');
// select first result
  elem = await page.waitForXPath("//span[contains(@class, 'product-title')]");
  await elem.click();
  await page.waitForTimeout(3000);

// go PgDn and take a screenshot
  await page.keyboard.press('PageDown');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();