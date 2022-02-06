require("dotenv").config();
import { GoogleSpreadsheet } from "google-spreadsheet";
import puppeteer from "puppeteer";
const nflWebsite = {
  url: "https://fantasy.nfl.com/research/pointsagainst",
};
let results: string[][] = [];

// Config variables
const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY.replace(/\n/g, "\n");
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
    console.log(row.type);
  } catch (e) {
    console.error("Error: ", e);
  }
};

async function scrapeTable(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    //slowMo: 10,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll("table tr");
    return Array.from(rows, (row) => {
      const columns = row.querySelectorAll("td");
      return Array.from(
        columns,
        (column) => (column as HTMLElement).textContent
      );
    });
  });
  await browser.close();
  return result;
}

(async function () {
  console.log(nflWebsite.url);
  results = await scrapeTable(nflWebsite.url);
  console.log(results);
  appendSpreadsheet(results);
})();
