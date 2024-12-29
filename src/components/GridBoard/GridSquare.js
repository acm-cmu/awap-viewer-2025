import React from "react"
import "./Grid.css"
import B1 from "../../assets/MapTiles/TileB1.png";
import B2 from "../../assets/MapTiles/TileB2.png";
import B3 from "../../assets/MapTiles/TileB3.png";
import B4 from "../../assets/MapTiles/TileB4.png";
import B5 from "../../assets/MapTiles/TileB5.png";

import N1 from "../../assets/MapTiles/TileN1.png";
import N2 from "../../assets/MapTiles/TileN2.png";
import N3 from "../../assets/MapTiles/TileN3.png";
import N4 from "../../assets/MapTiles/TileN4.png";
import N5 from "../../assets/MapTiles/TileN5.png";


const blockedImgArray = [B1, B2, B3, B4, B5];
const normalImgArray = [N1, N2, N3, N4, N5];


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
  const { color, imgIdx } = props
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
