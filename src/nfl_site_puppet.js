'use strict';
//require('dotenv').config();
// if you're going to run this, add "type": "module" to package.json
import 'dotenv/config'
import { GoogleSpreadsheet } from "google-spreadsheet";
import { launchChrome } from "./browser.js";
import puppeteer from 'puppeteer';
const nflWebsite = "https://fantasy.nfl.com/research/pointsagainst"
const fantPositions = ["QB", "RB", "WR", "TE", "K", "DST"]
let results = [];

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
// const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY.replace(/\n/g, '\n')
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function selectPosition(positions){
  for (const position of positions) {
   return positionClick;
  }
}

const clickBtn = async (page) => {
  try {
    const btn = await page.waitForXpath('//*[text()="RB"]');
    await btn.click(); // left clicks once
  } catch(e) {
    console.error("Unable to click button", e);
  }
};


async function scrapeTable(website) {
  
  clickBtn(page);
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


const appendSpreadsheet = async (row) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsById[sheetID];
    const result = await sheet.addRows(row);
    
    console.log(typeof(row))
  } catch (e) {
    console.error('Error: ', e);
  }
};



async function addToGSheets (nflWebsite) {
  console.log(nflWebsite);
  // loop through each position and scrape the table
  // for (const position of fantPositions) {
    // scrape the table
    const [newPage, exitChrome] = await launchChrome();
    const [page] = await newPage();
  
    // exit the function if the tab is not properly opened
    if (!page) return;
  
    // Flow 2 => Visiting a website's home page
    const url = nflWebsite;
    console.log("Opening " + url);
    try {
      await page.goto(url, {
        waitUntil: "networkidle0", // wait till all network requests has been processed
      });
    } catch(e) {
      console.error("Unable to visit " + url, e);
      await exitChrome(); // close chrome on error
      return; // exiting the function
    }
    results = await scrapeTable(nflWebsite);
    console.log(results);
    appendSpreadsheet(results);
    await exitChrome(); // close chrome
  };
  
export default scrapePersons;
const NFLFantSneet = addToGSheets(nflWebsite);
