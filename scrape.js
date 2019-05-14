
const puppeteer = require('puppeteer');
const url = 'https://www.yqr.ca/en/traveller-info/flight-information/arrivals-departures';
const $ = require('cheerio');
const fs = require('fs');
const departureSelector = 'button.departures.button'
const YQRDestinations = {
    "Cities": []
}

const uniqueSet = new Set();
puppeteer.launch().then(async browser => {
    const page = await browser.newPage();
    await page.goto(url);
    await page.click(departureSelector);
    await page.waitForSelector('button.departures.button.active');
    let html = await page.content();
    await $('td:nth-child(3)',html).each(function(i, elem) {
        if(uniqueSet.has($(this).text()))return true;
         uniqueSet.add($(this).text());
     });
    YQRDestinations.Cities = await [...uniqueSet].sort();
            
    await fs.writeFile('YQRDestinations.json', JSON.stringify(YQRDestinations), function(err){
        if (err) throw err;
        console.log("Successfully Written to File.");
    });
    await browser.close();
});