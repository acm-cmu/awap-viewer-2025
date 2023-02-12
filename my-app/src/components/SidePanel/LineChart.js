import React, { useContext } from "react"

import Chart from "react-google-charts"
import { ViewerContext } from "../../pages/Viewer"

/*
  [0, 0, 0],
  [1, 10, 5],
  [2, 23, 15],
  [3, 17, 9],
  [4, 18, 10],
  [5, 9, 5],
  [6, 11, 3],
  [7, 27, 19],
  [8, 27, 200],
*/

const LineChartOptions = {
  //title: "Metal Reserves",
  //backgroundColor: '#F9B697',
  //title: 'Company Performance',
  //subtitle: 'Sales, Expenses, and Profit: 2014-2017',

  chartArea: {
    backgroundColor: {
      fill: "#F4F4F4",
      opacity: 100,
    },
  },

  titleTextStyle: {
    fontName: "Impact",
    fontSize: 20,
  },
  hAxis: {
    title: "Frame",
    titleTextStyle: {
      fontName: "Roboto",
      fontStyle: "bold", //or bold, italic, etc.
      italic: false,
      fontSize: 12,
      //color: '#ff0000'
    },
  },
  vAxis: {
    title: "Metal",
    titleTextStyle: {
      fontName: "Roboto",
      fontStyle: "bold", //or bold, italic, etc.
      italic: false,
      fontSize: 12,
      //color: '#ff0000'
    },
    viewWindow: {
      min: 0,
    },
  },
  series: {
    1: { curveType: "function" },
  },
}

function LineChart() {
  const { frame, setFrame, redMetal, blueMetal, setRedMetal, setBlueMetal } =
    useContext(ViewerContext)

  var i = 0

  const LineData = [
    ["Frame", "Blue Team", "Red Team"],
    [0, 0, 0],
  ]

  //LineData.push(['Frame', 'Blue Team', 'Red Team'])
  //LineData.push([0,0,0])
  for (let redval of redMetal) {
    if (i == frame) {
      break
    }
    const temp = []
    temp.push(i)
    temp.push(blueMetal[i])
    temp.push(redMetal[i])
    LineData.push(temp)
    i += 1
  }

  return (
    <div className="container mt-5">
      <h1>Metal Graph</h1>
      <Chart
        width={"350px"}
        height={"250px"}
        chartType="LineChart"
        loader={<div>Loading Chart</div>}
        data={LineData}
        options={LineChartOptions}
        rootProps={{ "data-testid": "3" }}
      />
    </div>
  )
}
export default LineChart
