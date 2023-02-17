import React, {
    useContext,
  } from "react"
  
  import Chart from 'react-google-charts'
  import { ViewerContext } from '../../pages/Viewer'
  
  
  
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
  
    'chartArea': {
        'backgroundColor': {
            'fill': '#F4F4F4',
            'opacity': 100,
        },
    },
  
    titleTextStyle:{
        fontName: "Impact",
        fontSize: 20,
    },
    hAxis: {
        title: 'Frame',
        titleTextStyle:
        {
         fontName: "Roboto",
         fontStyle: "bold", //or bold, italic, etc.
         italic: false,
         fontSize: 12,
         //color: '#ff0000'
        },
    },
  vAxis: {
    title: 'Terraformed Tiles',
    titleTextStyle:
    {
     fontName: "Roboto",
     fontStyle: "bold", //or bold, italic, etc.
     italic: false,
     fontSize: 12,
     //color: '#ff0000'
    },
    viewWindow: {
      min: 0
    }
  },
  series: {
  },
  }
  
  
  function TerraformChart (){
      const {
        frame,
        setFrame,
        redTerraform,
        blueTerraform,
        setRedTerraform,
        setBlueTerraform,
        framePlaying,
        redRobots,
        blueRobots,
        replay,
        sliderValue
      } = useContext(ViewerContext)
  
  
      // console.log("frame " + frame)

      var totalFrame = 0
      if(replay != null){
        totalFrame = replay.turns.length - 1
      }

      var slideVal = 0 
      if (sliderValue == -1) {
        slideVal = 0
      } else {
        slideVal = sliderValue
      }
      // var frameCurr = frame
      // if ((frame - parseInt(frame)) != 0) {
      //   console.log("parseInt" + parseInt(frame))
      //   console.log(frame - parseInt(frame))
      // }
      
      //LineData.push(['Frame', 'Blue Team', 'Red Team'])
      //LineData.push([0,0,0])
      // console.log("newLineData: " + newLineData)
  
      // console.log("redMetal: " + redMetal
      // console.log(framePlaying)
      const LineData = [
        ['Frame', 'Blue Team', 'Red Team'],
        [0, 0, 0]
      ]
  
      for(let i = 0; i < frame; i++){
        const temp = []
        temp.push(i)
        temp.push(blueTerraform[i])
        temp.push(redTerraform[i])
        LineData.push(temp)
      }
  
      // console.log("LineChart: " + LineData)
  
  
      return (
        <div className="container mt-5">
          <h1> Frame: {slideVal} / {totalFrame}</h1>
          <h1> Red Robots: {redRobots} </h1>
          <h1> Blue Robots: {blueRobots} </h1>
          <h1>Terraform Graph</h1>
          <Chart
            width={'350px'}
            height={'250px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={LineData}
            options={LineChartOptions}
            rootProps={{ 'data-testid': '3' }}
          />
        </div>
      )
    
  }
  export default TerraformChart
  
  //<h1>{redMetal}</h1>