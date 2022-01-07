import React from 'react';
import logo from './logo.svg';
import './App.css';
const puppeteer = require('puppeteer')
require('dotenv').config({path: '../.env'})
const nflUrl: string = 'https://fantasy.nfl.com/research/pointsagainst'
const SHEET_ID = '1WPMqLzDcpJTUEz-gFj5kK8P_qQ20iZ3WwV1GsW2u7-k';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

class App extends React.Component {
  updateSheetValues = () => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}:batchUpdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({

        requests: [{
          repeatCell: {
            range: {
              startColumnIndex: 0,
              endColumnIndex: 1,
              startRowIndex: 0,
              endRowIndex: 1,
              sheetId: 0
            },
            cell: {
              userEnteredValue: {
                "numberValue": 10
              },
            },
            fields: "*"
          }
        }]

      })
    })
  }
  render() {
    return ( 
      <div className = "App" >
        hello world 
        <button onClick={this.updateSheetValues}>Update A1</button>
      </div>
    );

  }
}

export default App;