const { CronJob } = require('cron');
const puppeteer = require('puppeteer');
const job = require('./job');
const uploadFile = require('./uploadFile');

const cron = new CronJob('0 0 1 * * *', async () => {
  await job();
});

cron.start();
