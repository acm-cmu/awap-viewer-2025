import React from "react"
import "./Grid.css"

/*
  Color labels:
  0 - empty
  1 - impassable
  2 - metal
  5 - trail (empty color)
  -#0 red
  #0 blue
*/

export default function GridSquare(props) {
  const { color, imgIdx, normalImgArray, blockedImgArray } = props
  const classes = `grid-square color-${color}`
  let useImg = null;

  switch (Number(color)) {
    case 0:
      useImg = normalImgArray[imgIdx]
      break;

    case 1:
      useImg = blockedImgArray[imgIdx]
      break;

    default:
      useImg = null;
      break;
  }
  return (
    <div className={`tile-div ${classes}`}>
      {useImg !== null ? <img src={useImg} className="tileBgImg" alt="" /> : <div></div>}
    </div>
  )
}
