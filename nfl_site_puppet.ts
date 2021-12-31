const puppeteer = require('puppeteer')
require('dotenv').config()
const nflUrl: string = 'https://fantasy.nfl.com/research/pointsagainst'
const SHEET_ID = '1WPMqLzDcpJTUEz-gFj5kK8P_qQ20iZ3WwV1GsW2u7-k'
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

async function scrapeTable (url: string) {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    defaultViewport: null
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2' })
  const result = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tr')
    return Array.from(rows, row => {
      const columns = row.querySelectorAll('td')
      return Array.from(columns, column => (column as HTMLElement).textContent)
    })
  })
  await browser.close()
  return result
}

// const nflResults = await scrapeTable(nflUrl)
// console.log(nflResults)
(async function () {
  const nflResults = await scrapeTable(nflUrl)
  console.log(nflResults)
})()
