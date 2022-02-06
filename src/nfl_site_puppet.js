//require('dotenv').config();
// if you're going to run this, add "type": "module" to package.json
import 'dotenv/config'
import { GoogleSpreadsheet } from "google-spreadsheet";
import puppeteer from 'puppeteer';
const nflWebsite = {
  url: "https://fantasy.nfl.com/research/pointsagainst",
};

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY.replace(/\n/g, '\n')
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const appendSpreadsheet = async (row) => {
 
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsById[SHEET_ID];
    const result = await sheet.addRows(row);
    console.log(typeof(row))
  } catch (e) {
    console.error('Error: ', e);
  }
};

async function scrapeTable (url) {
  const browser = await puppeteer.launch({
    headless: true,
    //slowMo: 10,
    defaultViewport: null
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tr')
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td')
      console.log(typeof(columns))
      return Array.from(columns, column => (column).textContent)
    })
  })
  await browser.close()
  return result
}


(async function () {
  console.log(nflWebsite.url)
  const results = await scrapeTable(nflWebsite.url)
  console.log(results)
  // for (let i of results) {
  //   console.log(typeof(i))
  //   console.log(typeof(results))
  //   //let team = i[0]
  //   // need to define either the array more specifically or figure out how to define i
  //   let team = i[0]
  //   console.log(team)
  //   console.log(typeof(team))
    appendSpreadsheet(results)
//}
})();
