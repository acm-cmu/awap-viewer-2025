import React, { useContext, useState} from "react"
import { ViewerContext } from "../../pages/Viewer"
import "./Grid.css"

export default function RobotSquare(props) {
  const { srcImg, x, y, type, hasRobot, battery} = props
  const { setCol, setRow, tiles} = useContext(ViewerContext)

  const [tiletype, setTileType] = useState(null)
  const [tilevisib, setTileVisib] = useState(null)

  const handleHover = (col, row) => {
    setCol(col)
    setRow(row)
    if (col != null && row != null) {
      switch(tiles[row][col][0]) {
        case "I":
          setTileType("Type: Impassable")
          break;
        case "M":
          setTileType("Type: Metal")
          break;
        default:
          setTileType("Terr. No.: " + tiles[row][col][0])
      }
      switch(tiles[row][col][1]) {
        case 0:
          setTileVisib("None")
          break;
        case 1:
          setTileVisib("Red")
          break;
        case 2:
          setTileVisib("Blue")
          break;
        default:
          setTileVisib("Both")
      }
    }
  }

  return (
    <div className="tile-div">
      {hasRobot ? (
        <div className="grid-square">
        <img
          id={`robot${x}${y}`}
          src={srcImg}
          alt=""
          className="grid-square"
          onMouseOver={() => {
            handleHover(x, y)
          }}
          onMouseOut={() => {
            handleHover(null, null)
          }}
        />
        <p className="tooltiptext"> 
        Position: {x}, {y} <br></br>
        {tiletype} <br></br>
        Visibility: {tilevisib} <br></br>
        Robot: {type}, {battery} <br></br>
        </p>
        </div>
      ) : (
        <div
          id={`robot${x}${y}`}
          className="grid-square"
          onMouseOver={() => {
            handleHover(x, y)
          }}
          onMouseOut={() => {
            handleHover(null, null)
          }}
        >
        <p className="tooltiptext"> 
        Position: ({x}, {y}) <br></br>
        {tiletype} <br></br>
        Visibility: {tilevisib} <br></br>
        </p></div>
      )}
    </div>
  )
}
