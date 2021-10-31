const puppeteer = require('puppeteer');
const uploadFile = require('./uploadFile');

const getSearchTerms = require('./getSearchTerms');
const createLead = require('./createLead');
const crawlPage = require('./crawlPage');

const job = async () => {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  console.log('Run Job');

  const { API_ROOT, BUCKET_NAME } = process.env;

  const searchTerms = await getSearchTerms(API_ROOT);
  console.log('Searching for: ', searchTerms);

  for (term in searchTerms) {
    const imageArray = await crawlPage(BUCKET_NAME, searchTerms[term]);

    await createLead(API_ROOT, { links: imageArray });
  }
};

module.exports = job;
