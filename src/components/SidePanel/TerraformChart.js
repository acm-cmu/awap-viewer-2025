import React, { useContext } from "react"
import "./SidePanel.css"
import Stack from "@mui/material/Stack"
import Chart from "react-google-charts"
import { ViewerContext } from "../../pages/Viewer"

const LineChartOptions = {
  backgroundColor: {
    fill: "#F9B697",
    stroke: "#663926",
    strokeWidth: 2,
  },
  chartArea: {
    backgroundColor: {
      fill: "#F9B697",
      opacity: 100,
    },
    width: "70%",
    height: "70%",
  },

  titleTextStyle: {
    fontName: "Impact",
    fontSize: 20,
  },

  hAxis: {
    title: "Frame",
    titleTextStyle: {
      fontName: "Roboto",
      fontStyle: "bold",
      italic: false,
      fontSize: "2vmin",
      color: "#663926",
    },
    baselineColor: "#421f0f",
    gridlines: {
      color: "#663926",
    },
    minorGridlines: {
      color: "#92624e",
    },
    textStyle: {
      color: "#663926",
    },
  },
  vAxis: {
    title: "Terraformed Tiles",
    titleTextStyle: {
      fontName: "Roboto",
      fontStyle: "bold",
      italic: false,
      fontSize: "2vmin",
      color: "#663926",
    },
    viewWindow: {
      min: 0,
    },
    baselineColor: "#421f0f",
    gridlines: {
      color: "#663926",
    },
    minorGridlines: {
      color: "#92624e",
    },
    textStyle: {
      color: "#663926",
    },
  },
  legend: {
    textStyle: {
      fontName: "Roboto",
      fontStyle: "bold",
      fontSize: "1vmin",
      color: "#663926",
    },
    position: "bottom",
  },
  series: {},
}

function TerraformChart() {
  const { frame, redTerraform, blueTerraform } = useContext(ViewerContext)

  const LineData = [
    ["Frame", "B", "R"],
    [0, 0, 0],
  ]

  for (let i = 0; i < frame; i++) {
    const temp = []
    temp.push(i)
    temp.push(blueTerraform[i])
    temp.push(redTerraform[i])
    LineData.push(temp)
  }

  return (
    <div>
      <div className="vert-container graph">
        <h2 className="info stats">Terraform Graph</h2>
        <Chart
          width={"13vw"}
          height={"100%"}
          chartType="LineChart"
          loader={<div>Loading Chart</div>}
          data={LineData}
          options={LineChartOptions}
          rootProps={{ "data-testid": "3" }}
        />
      </div>
    </div>
  )
}
export default TerraformChart
