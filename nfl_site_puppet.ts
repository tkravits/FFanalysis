const puppeteer = require('puppeteer');
let nfl_url: string = "https://fantasy.nfl.com/research/pointsagainst";

async function scrape_table(url: string) {
  const browser = await puppeteer.launch({ headless: false, 
    slowMo: 250, defaultViewport: null});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const result = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tr');
      return Array.from(rows, row => {
        const columns = row.querySelectorAll('td');
        return Array.from(columns, column => (column as HTMLElement).innerText);
      });
    });
  
    
    await browser.close();
    return result;
}

const nfl_results = scrape_table(nfl_url);
console.log(nfl_results);