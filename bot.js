const { CronJob } = require('cron');
const puppeteer = require('puppeteer');
const job = require('./job');
const uploadFile = require('./uploadFile');

const cron = new CronJob('*/15 * * * * *', async () => {
  await job();
});

cron.start();
