const puppeteer = require('puppeteer');
const uploadFile = require('./uploadFile');

const run = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://google.com');

  const screenshot = await page.screenshot();

  const uploadResult = await uploadFile(screenshot);

  console.log(uploadResult);

  await browser.close();
};

run();
