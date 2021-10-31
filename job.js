const puppeteer = require('puppeteer');
const uploadFile = require('./uploadFile');

const getSearchTerms = require('./getSearchTerms');
const createLead = require('./createLead');

const job = async () => {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  console.log('Run Job');

  const { BUCKET_NAME, API_ROOT } = process.env;

  const searchTerms = await getSearchTerms(API_ROOT);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (term in searchTerms) {
    const imageArray = [];

    await page.goto(
      `https://animalskinsandbones.com/?s=${term}&post_type=product`,
    );

    const screenshot = await page.screenshot();

    const uploadResult = await uploadFile(BUCKET_NAME, screenshot);

    imageArray.push(uploadResult.Location);

    await createLead(API_ROOT, { links: imageArray });
  }

  await browser.close();
};

module.exports = job;
