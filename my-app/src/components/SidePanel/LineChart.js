import React, { Component } from 'react'
import Chart from 'react-google-charts'
const LineData = [
  ['Frame', 'Blue Team', 'Red Team'],
  [0, 0, 0],
  [1, 10, 5],
  [2, 23, 15],
  [3, 17, 9],
  [4, 18, 10],
  [5, 9, 5],
  [6, 11, 3],
  [7, 27, 19],
  [8, 27, 200],
]

const LineChartOptions = {
    //title: "Metal Reserves",
    titleTextStyle:{
        fontName: "Impact",
        fontSize: 20,
    },
    hAxis: {
        title: 'Frame',
        titleTextStyle:
        {
         fontName: "Impact",
         fontStyle: "normal", //or bold, italic, etc.
         italic: false,
         fontSize: 14,
         //color: '#ff0000'
        },
    },
  vAxis: {
    title: 'Metal',
    titleTextStyle:
    {
     fontName: "Impact",
     fontStyle: "normal", //or bold, italic, etc.
     italic: false,
     fontSize: 14,
     //color: '#ff0000'
    },
  },
  series: {
    1: { curveType: 'function' },
  },
}
class LineChart extends Component {
  render() {
    return (
      <div className="container mt-5">
        <h1>Metal Graph</h1>
        <Chart
          width={'300px'}
          height={'200px'}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={LineData}
          options={LineChartOptions}
          rootProps={{ 'data-testid': '3' }}
        />
      </div>
    )
  }
}
export default LineChart