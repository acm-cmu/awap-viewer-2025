import React, { useState, useContext, createContext } from "react"
import "../GridBoard/Grid.css"
import { ViewerContext } from "../../pages/MapMaker"
import MetalImg from "../../img/metal.png"

export default function MapMakerGridSquare(props) {
  const { x, y } = props

  const {
    rows,
    cols,
    mapObj,
    setMapObj,
    Mnum,
    brushPreset,
    Hsym,
    Vsym,
    Rsym
  } = useContext(ViewerContext)

  let impassable = mapObj[x][y][0] == "I"
  let blueTile = mapObj[x][y][1] == 5
  let redTile = mapObj[x][y][1] == -5
  let mining = mapObj[x][y][0] == "M"

  function setI(i, j) {
    const temp = { ...mapObj };
    temp[i][j][0] = 'I';
    temp[i][j][1] = 0;
    temp[i][j][2] = 0;
    setMapObj(temp);
  }

  function setT(i, j) {
    const temp = { ...mapObj };
    mapObj[i][j][0] = 'T';
    mapObj[i][j][1] = 0;
    mapObj[i][j][2] = 0;
    setMapObj(temp);
  }

  function setM(i, j) {
    const temp = { ...mapObj };
    mapObj[i][j][0] = 'M';
    mapObj[i][j][1] = 0;
    if (Mnum == null) { mapObj[x][y][2] = 5; }
    else { mapObj[x][y][2] = Mnum; }
    setMapObj(temp);
  }

  function setR(i, j) {
    const temp = { ...mapObj };
    mapObj[i][j][0] = 'T';
    mapObj[i][j][1] = -5;
    mapObj[i][j][2] = 0;
    setMapObj(temp);
  }

  function setB(i, j) {
    const temp = { ...mapObj };
    mapObj[i][j][0] = 'T';
    mapObj[i][j][1] = 5;
    mapObj[i][j][2] = 0;
    setMapObj(temp);
  }

  const handleClick = (e) => {
    if (e.type == "click" || e.type == "mouseover" && (e.buttons == 1 || e.buttons == 3)) {
      if (brushPreset == "I") {
        setI(x, y);
        if (Hsym) { setI(x, cols - y - 1) }
        if (Vsym) { setI(rows - x - 1, y) }
        if (Rsym) { setI(rows - x - 1, cols - y - 1) }
      }
      else if (brushPreset == "T") {
        setT(x, y);
        if (Hsym) { setT(x, cols - y - 1) }
        if (Vsym) { setT(rows - x - 1, y) }
        if (Rsym) { setT(rows - x - 1, cols - y - 1) }
      }
      else if (brushPreset == "M") {
        setM(x, y);
        if (Hsym) { setM(x, cols - y - 1) }
        if (Vsym) { setM(rows - x - 1, y) }
        if (Rsym) { setM(rows - x - 1, cols - y - 1) }
      }
      else if (brushPreset == "R") {
        setR(x, y);
        if (Hsym) { setB(x, cols - y - 1) }
        if (Vsym) { setB(rows - x - 1, y) }
        if (Rsym) { setB(rows - x - 1, cols - y - 1) }
      }
      else if (brushPreset == "B") {
        setB(x, y);
        if (Hsym) { setR(x, cols - y - 1) }
        if (Vsym) { setR(rows - x - 1, y) }
        if (Rsym) { setR(rows - x - 1, cols - y - 1) }
      }
      console.log(mapObj[x][y]);
    }
  }

  return (
    <div className={
      blueTile ? "tile-div grid-square color-3" :
        redTile ? "tile-div grid-square color-4" :
          mining ? 'tile-div grid-square color-2' :
            impassable ? 'tile-div grid-square color-1' :
              'tile-div grid-square color-0'}
      onClick={handleClick} onMouseOver={handleClick}>
      {mining ? <img src={MetalImg} alt="" /> : <div></div>}
    </div>
  )
}
