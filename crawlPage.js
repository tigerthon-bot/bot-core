const puppeteer = require('puppeteer');
const uploadFile = require('./uploadFile');

function isProduct(value, index, array) {
  return value.indexOf('/product/') >= 0;
}

const crawlPage = async (bucketName, term) => {
  const browser = await puppeteer.launch(); // default is true
  const page = await browser.newPage();
  await page.setViewport({
    width: 1024,
    height: 960,
    deviceScaleFactor: 1,
  });

  // open page and search for term
  let pageUrl = `https://animalskinsandbones.com/?s=${term}&post_type=product`;
  await page.goto(pageUrl);

  // TODO: Manage no results found

  // get number of results
  await page.waitForSelector('p.woocommerce-result-count');
  let element = await page.$('p.woocommerce-result-count');
  let strNResults = await page.evaluate((el) => el.textContent, element);
  let arrNResults = strNResults.split(' ');
  if (arrNResults[1] == 'all') {
    // only one page of results
    intMaxResults = eval(arrNResults[2]);
    intMinShowResults = 1;
    intMaxShowResults = intMaxResults;
  } else {
    // multiple results pages
    const intMaxResults = eval(arrNResults[3]);
    console.log('MaxResults = ' + intMaxResults);
    let arrShowResults = arrNResults[1].split('–');
    console.log(arrShowResults);
    intMinShowResults = eval(arrShowResults[0]);
    intMaxShowResults = eval(arrShowResults[1]);
  }

  const ProductsPerPage = 15; // CONFIGURE Products per page. We find more than 15 links in each page although it counts 15 products. tbd
  var PageNumber = 1;
  var OldPageNumber = 1;

  var StartResult = intMinShowResults;

  const imageUrls = [];

  do {
    console.log(StartResult);
    // deal with supplementary pages in search results
    if (StartResult == 1) {
      pageUrl = pageUrl.replace(
        'https://animalskinsandbones.com/',
        'https://animalskinsandbones.com/page/1/',
      );
      console.log(pageUrl);
    } else {
      OldPageNumber = PageNumber++;
      pageUrl = pageUrl.replace(
        '/page/' + OldPageNumber + '/',
        '/page/' + PageNumber + '/',
      );
      await page.goto(pageUrl);
      console.log(pageUrl);
    }

    // works: get all links in the page
    const hrefs1 = await page.$$eval('a', (as) => as.map((a) => a.href));
    const hrefs2 = hrefs1.filter(isProduct); // filter only products
    const hrefs = hrefs2.filter(function (elem, pos) {
      // remove duplicates
      return hrefs2.indexOf(elem) == pos;
    });
    // iterate over the array of links
    for (var link of hrefs) {
      const page2 = await browser.newPage(); // open new tab
      console.log('Opening ' + link);
      await page2.goto(link); // open product page
      await page2.bringToFront();
      // go PgDn and take a screenshot
      await page2.keyboard.press('PageDown');
      await page2.waitForTimeout(3000);
      var name = link.replace('https://animalskinsandbones.com/product/');
      name = name.replace('/', '');
      console.log('Saving ' + name + '.png');
      const screenshot = await page2.screenshot();

      const uploadResult = await uploadFile(bucketName, screenshot);
      imageUrls.push(uploadResult.Location);

      await page.waitForTimeout(2000); // wait a couple of seconds just in case
      await page2.close;
    }
    // let's see if there are other pages for this search
    StartResult = StartResult + ProductsPerPage;
  } while (StartResult < intMaxResults); // condition to open next search results page

  await browser.close();
  return imageUrls;
};

module.exports = crawlPage;
