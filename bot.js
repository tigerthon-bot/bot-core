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
const term="tiger";
var pageurl="https://animalskinsandbones.com/"

// open page and search for term
  await page.goto(pageurl);  
  await page.type('input[name=s]', term);
  await page.keyboard.press('\n');
  pageurl = await page.url();


// get number of results
 /* (async() => {
	try 
	{
		page.waitForSelector('p.woocommerce-result-count');
	} catch(error)   { console.log("No results found for "+term) };		// TODO IF NO RESULTS FROM SEARCH
  } )  */
  
  await page.waitForSelector('p.woocommerce-result-count');
  let element = await page.$('p.woocommerce-result-count');
  let strNResults = await page.evaluate(el => el.textContent, element);
  let arrNResults = strNResults.split(" ");
  console.log(arrNResults);
  if (arrNResults[1] == "all")
  {
	  // only one page of results
	  intMaxResults = eval(arrNResults[2]);
	  intMinShowResults = 1;
	  intMaxShowResults = intMaxResults;
  }
  else
  {
	  // multiple results pages
	  const intMaxResults = eval(arrNResults[3]);
	  console.log("MaxResults = " + intMaxResults);
	  let arrShowResults = (arrNResults[1]).split("–");
	  console.log(arrShowResults);
	  intMinShowResults = eval(arrShowResults[0]);
	  intMaxShowResults = eval(arrShowResults[1]);
  }
  console.log("Showing " + intMinShowResults + " ... " + intMaxShowResults);

  const ProductsPerPage = 15;									// CONFIGURE Products per page. We find more than 15 links in each page although it counts 15 products. tbd
  var PageNumber = 1;
  var OldPageNumber = 1;
  
  let StartResult = intMinShowResults;
  
  do {

	  // deal with supplementary pages in search results
	  if (StartResult = 1)
		  pageurl=pageurl.replace("https://animalskinsandbones.com/","https://animalskinsandbones.com/page/1/");
	  else {
		 OldPageNumber = PageNumber++;
         pageurl=pageurl.replace("/page/" + OldPageNumber + "/", "/page/" + PageNumber + "/") 
	     await page1.goto();
	  }
  
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
		 await page2.keyboard.press('PageDown');
		 await page2.keyboard.press('ArrowDown'); 
		 await page2.keyboard.press('ArrowDown'); 
		 await page2.keyboard.press('ArrowDown'); 
		 await page2.keyboard.press('ArrowDown'); 
		 await page2.keyboard.press('ArrowDown');
		 await page2.waitForTimeout(5000);

		 var name = (link.replace("https://animalskinsandbones.com/product/"))
		 name = name.replace("/","");
		 console.log('Saving ' + name + '.png');			// TODO: SOMETHING WRONG WITH FILENAME. IT ADDS undefined IN FRONT OF NAME
		 await page2.screenshot({ path: name + '.png' });	// THIS IS WHERE IT SHOULD UPLOAD THE IMAGE
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
