require("dotenv").config();
import { GoogleSpreadsheet } from "google-spreadsheet";
import puppeteer from "puppeteer";


interface Website {
  url: string
  position?: string;
  positions?: Array<string>;
};

const nflWebsite: Website = {
  url: "https://fantasy.nfl.com/research/pointsagainst",
  positions: ["QB", "RB", "WR", "TE", "K", "DST"]
};

let results: string[][] = [];

// Config variables
const SPREADSHEET_ID: string = process.env.SPREADSHEET_ID as string;
const SHEET_ID: string = process.env.REACT_APP_SHEET_ID as string;
const CLIENT_EMAIL: string = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL as string;
process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY?.replace(/\n/g, "\n");
const PRIVATE_KEY: string = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY as string;

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const appendSpreadsheet = async (row: string[][]) => {
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsById[SHEET_ID];
    const result = await sheet.addRows(row);
    //console.log(row.type);
  } catch (e) {
    console.error("Error: ", e);
  }
};

async function scrapeTable(nflWebsite: Website) {
  const browser = await puppeteer.launch({
    headless: false,
    //slowMo: 10,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(nflWebsite.url, { waitUntil: "networkidle2" });
  for (var el of nflWebsite.positions!) {
  let positionClick: string = await page.evaluate(() => {
    console.log("Evaluating");
    console.log(el);
    document.querySelector("//*[text()=" + el + "]")
    console.log(positionClick);
    return positionClick;
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

async function addToGSheets (nflWebsite: Website) {
  console.log(nflWebsite.url);
  results = await scrapeTable(nflWebsite);
  console.log(results);
  appendSpreadsheet(results);
}
const QBSheets = addToGSheets(nflWebsite);
console.log(QBSheets);