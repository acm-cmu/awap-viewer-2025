import React, { useContext, useState } from "react"
import { ViewerContext } from "../../pages/Viewer"
import "./Grid.css"

export default function RobotSquare(props) {
  const { srcImg, x, y, type, hasRobot, battery, id } = props
  const { setCol, setRow, tiles } = useContext(ViewerContext)

  const [tiletype, setTileType] = useState(null)
  const [boldtiletype, setBoldTileType] = useState(null)
  const [tilevisib, setTileVisib] = useState(null)
  const [robottype, setRobotType] = useState(null)

  const handleHover = (col, row) => {
    setCol(col)
    setRow(row)
    if (tiles != null && col != null && row != null) {
      switch (tiles[row][col][0]) {
        case "I":
          setTileType("Impassable")
          setBoldTileType("Type: ")
          break
        case "M":
          setTileType("Metal")
          setBoldTileType("Type: ")
          break
        default:
          setTileType(tiles[row][col][0])
          setBoldTileType("Terr. Level: ")
      }
      switch (tiles[row][col][1]) {
        case 0:
          setTileVisib("None")
          break
        case 1:
          setTileVisib("Red")
          break
        case 2:
          setTileVisib("Blue")
          break
        default:
          setTileVisib("Both")
      }
    }
    switch (type) {
      case "e":
        setRobotType("Explorer")
        break
      case "m":
        setRobotType("Miner")
        break
      default:
        setRobotType("Terraformer")
        break
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
            <strong> Position: </strong> {x}, {y} <br></br>
            <strong> {boldtiletype} </strong> {tiletype} <br></br>
            <strong> Visibility: </strong> {tilevisib} <br></br>
            <strong> Robot: </strong>
            {id}, {robottype}, {battery} <br></br>
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
            <strong> Position: </strong> ({x}, {y}) <br></br>
            <strong> {boldtiletype} </strong> {tiletype} <br></br>
            <strong> Visibility: </strong> {tilevisib} <br></br>
          </p>
        </div>
      )}
    </div>
  )
}
