const puppeteer = require('puppeteer');
const querystring = require('querystring');
const url = require('url');


(async () => {
  const browser = await puppeteer.launch({ headless: false }); // default is true
  const page = await browser.newPage();
  await page.setViewport({
  	width: 1024,
	height:960,
	deviceScaleFactor: 1,
	});

// get the search term  CANT WORK THIS OUT
/*  const url = await page.url();
  const search_params = url.searchParams;
  const term = search_params.req.url("term")						// CONFIGURE parameter names 
  const pageurl = search_params.get("pageurl")
*/
const term="sale";
const pageurl="https://animalskinsandbones.com/"

// open page and search for term
  await page.goto(pageurl);  
  await page.type('input[name=s]', term);
  await page.keyboard.press('\n');


// TODO: Manage no results found
  
// get number of results
  await page.waitForSelector('p.woocommerce-result-count');
  let element = await page.$('p.woocommerce-result-count');
  let strNResults = await page.evaluate(el => el.textContent, element);
  let arrNResults = strNResults.split(" ");
  const intMaxResults = eval(arrNResults[3]);
  console.log("MaxResults = " + intMaxResults);
  
  let arrShowResults = (arrNResults[1]).split("–");
  let intMinShowResults = eval(arrShowResults[0]);
  let intMaxShowResults = eval(arrShowResults[1]);
  console.log("Showing " + intMinShowResults + " ... " + intMaxShowResults);

  const ProductsPerPage = 15									// CONFIGURE Products per page. We find more than 15 links in each page although it counts 15 products. tbd

  let StartResult = intMinShowResults
  
  do {

	// TODO reopen the link from page 1

	// this works - select first result but no way of selecting remaining ones
	/*
	  elem = await page.waitForXPath("//span[contains(@class, 'woocommerce-loop-product__link')]");
	  await elem.click();
	  await page.waitForTimeout(3000);
	*/

	// doesn't work - find all results for iteration
	/*  const selectors = await page.$$("product-title");
	  console.log(selectors.length); // number of selectors found on this page
	*/

	// works: get all links in the page
	  const hrefs1 = await page.$$eval('a', as => as.map(a => a.href));
	  const hrefs2  = hrefs1.filter(isProduct);				// filter only products
	  const hrefs =  hrefs2.filter(function(elem, pos) {	// remove duplicates
		return hrefs2.indexOf(elem) == pos;
	})
	  console.log(hrefs);

	// iterate over the array of links 
	  for (var link of hrefs)
	  {
		 const page2 = await browser.newPage();        // open new tab
		 console.log("Opening " + link);
		 await page2.goto(link);       				// open product page
		 await page2.bringToFront();	  
	// go PgDn and take a screenshot
		 await page2.keyboard.press('PageDown');
		 await page2.waitForTimeout(3000);
		 const name = (link.replace("https://animalskinsandbones.com/product/"))
		 name = name.replace("/","");
		 console.log('Saving ' + name + '.png');
		 await page2.screenshot({ path: name + '.png' });
		 await page.waitForTimeout(2000);					// wait a couple of seconds just in case
		 await page2.close 	 
	  }
	  
	// let's see if there are other pages for this search
	StartResult = StartResult + ProductsPerPage;
  } while (StartResult < intMaxResults);					// condition to open next search results page
	
  
  await browser.close();
})();


function isProduct(value, index, array) {
  return (value.indexOf("/product/")>=0)
}