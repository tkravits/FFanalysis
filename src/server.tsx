const puppeteer = require('puppeteer');
const express = require('express');
const nflUrl: string = 'https://fantasy.nfl.com/research/pointsagainst';
const app = express();

app.get('/pullnflsite', async (req, res) => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 250,
        defaultViewport: null
      })
      const page = await browser.newPage()
      await page.goto(req.nflUrl, { waitUntil: 'networkidle2' })
      const result = await page.evaluate(() => {
        const rows = document.querySelectorAll('table tr')
        return Array.from(rows, row => {
          const columns = row.querySelectorAll('td')
          return Array.from(columns, column => (column as HTMLElement).textContent)
        })
      })
      await browser.close()
      res.sendStatus(200);
      return result
    }
)

app.listen(4000);