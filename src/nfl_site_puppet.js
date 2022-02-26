'use strict';
//require('dotenv').config();
// if you're going to run this, add "type": "module" to package.json
import 'dotenv/config'
import { GoogleSpreadsheet } from "google-spreadsheet";
import puppeteer from 'puppeteer';
const nflWebsite = "https://fantasy.nfl.com/research/pointsagainst"
const fantPositions = ["QB", "RB", "WR", "TE", "K", "DST"]

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

async function scrapeTable(nflWebsite) {
  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 10,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(nflWebsite, { waitUntil: "networkidle2" });
  for (const i in fantPositions) {
    const positions = await page.evaluate(() => Array.from(document.querySelector("//*[text()=" + fantPositions[i] + "]"), e => e.innerText));
    positions.forEach(positionClick => {
    console.log(positionClick);
    });
  await page.click(positionClick);
}
 


  const result = await page.evaluate(() => {
    
    const rows = document.querySelectorAll("table tr");
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll("td");
      return Array.from(
        columns,
        (column) => (column).textContent
      );
    });
  });
  await browser.close();
  return result;
}

async function addToGSheets (nflWebsite) {
  console.log(nflWebsite);
  results = await scrapeTable(nflWebsite);
  console.log(results);
  appendSpreadsheet(results);
}
const QBSheets = addToGSheets(nflWebsite);
console.log(QBSheets);
