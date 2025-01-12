import React, { useState, useContext, createContext } from "react"
import "../GridBoard/Grid.css"
import { ViewerContext } from "../../pages/MapMaker"
import MetalImg from "../../img/metal.png"

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

const blockedImgCnt = 5;
const normalImgCnt = 5;
const blockedImgArray = [B1, B2, B3, B4, B5];
const normalImgArray = [N1, N2, N3, N4, N5];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RandBlockedTile() {
  return blockedImgArray[randomInt(0, blockedImgCnt - 1)];
}

function RandNormalTile() {
  return normalImgArray[randomInt(0, normalImgCnt - 1)];
}

function RandTileColor(color) {
  switch (Number(color)) {
    case 0:
      return RandNormalTile();

    case 1:
      return RandBlockedTile();

    default:
      return null;
  }
}

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

  let normal = mapObj[x][y] == "GRASS"
  let impassable = mapObj[x][y] == "IMPASSIBLE"
  let blueTile = mapObj[x][y] == "BLUE"
  let redTile = mapObj[x][y] == "RED"
  let mining = mapObj[x][y] == "M"

  function setI(i, j) {
    const temp = mapObj.slice();
    temp[i][j] = 'IMPASSIBLE';
    setMapObj(temp);
  }

  function setT(i, j) {
    const temp = mapObj.slice();
    temp[i][j] = 'GRASS';
    setMapObj(temp);
  }

  function setM(i, j, final_mining) {
    const temp = mapObj.slice();
    temp[i][j] = 'M';
    setMapObj(temp);
  }

  function setR(i, j) {
    const temp = mapObj.slice();
    temp[i][j] = 'T';
    setMapObj(temp);
  }

  function setB(i, j) {
    const temp = mapObj.slice();
    temp[i][j] = 'T';
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
        const final_mining = Mnum == null ? 5 : Mnum;
        setM(x, y, final_mining);
        if (Hsym) { setM(x, cols - y - 1, final_mining) }
        if (Vsym) { setM(rows - x - 1, y, final_mining) }
        if (Rsym) { setM(rows - x - 1, cols - y - 1, final_mining) }
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
      // console.log(mapObj[x][y]);
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
      {normal ? <img src={RandNormalTile()} alt="" /> : <div></div>}
      {impassable ? <img src={RandBlockedTile()} alt="" /> : <div></div>}
      {mining ? <img src={MetalImg} alt="" /> : <div></div>}
    </div>
  )
}
