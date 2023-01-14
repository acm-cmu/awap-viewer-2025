import React, { useContext } from "react"
import { ViewerContext } from "../../pages/Viewer"
import "./Grid.css"

export default function RobotSquare(props) {
  const { srcImg, x, y, hasRobot } = props
  const { setXCoord, setYCoord } = useContext(ViewerContext)

  const handleHover = (xVal, yVal) => {
    setXCoord(xVal)
    setYCoord(yVal)
  }
  return (
    <div className="tile-div">
      {hasRobot ? (
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
        ></div>
      )}
    </div>
  )
}
