'use strict';
import { waitFor } from '@testing-library/react';
//require('dotenv').config();
// if you're going to run this, add "type": "module" to package.json
import 'dotenv/config'
import { GoogleSpreadsheet } from "google-spreadsheet";
//import { launchChrome } from "./browser.js";
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

async function clickPosition(page, position){
  const element = await page.$x('//*[text()="' + position + '"]');
  await element[0].click();
}

async function scrapeTable(page) {
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
  return result;
}


const appendSpreadsheet = async (row) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsById[0];
    const result = await sheet.addRows(row);
    
    console.log(typeof(row))
  } catch (e) {
    console.error('Error: ', e);
  }
};



async function addToGSheets (nflWebsite) {
  results = await scrapeTable(nflWebsite);
  console.log(results);
  appendSpreadsheet(results);
}
  
// const NFLFantSneet = addToGSheets(nflWebsite);

async function init(){
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(nflWebsite);
  await Promise.all([
    page.waitForNavigation(),
    clickPosition(page, "RB"),
]);
  
  appendSpreadsheet(results);
  await browser.close();
};

init();