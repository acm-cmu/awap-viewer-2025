import React from "react"
import "./Grid.css"
import BlueCastle from "../../assets/BlueCastle.png"
import RedCastle from "../../assets/RedCastle.png"
import Exploded from "../../assets/explosion.png"

/*
  Type labels:
  0 - main castle
  1 - Ship
  2 - Farmlands
  3 - Exploded
*/

export default function BuildSquare(props) {
  const { color, type } = props
  const classes = `grid-square`
  let useImg = null;

  switch (color) {
    case "RED":
      switch (type) {
        case 0:
          useImg = RedCastle
          break;
        case 3:
          useImg = Exploded
          break;
        default:
          break
      }
      break;

    default: // BLUE
      switch (type) {
        case 0:
          useImg = BlueCastle
          break;
        case 3:
          useImg = Exploded
          break;
        default:
          break
      }
      break;
  }
  return (
    <div className={`tile-div ${classes}`}>
      {useImg !== null ? <img src={useImg} className="tileBgImg" alt="" /> : <div></div>}
    </div>
  )
}