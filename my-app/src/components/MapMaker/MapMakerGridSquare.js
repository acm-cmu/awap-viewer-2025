import React, { useState, useContext } from "react"
import "../GridBoard/Grid.css"
import { ViewerContext } from "../../pages/MapMaker"
import MetalImg from "../../img/metal_outline.png"

export default function MapMakerGridSquare(props) {
  const { color, useImg, x, y } = props

  const {
    rows,
    setRows,
    cols,
    setCols,
    showMap,
    setShowMap,
    mapObj,
    setMapObj,
    Tnum,
    setTnum,
    Mnum,
    setMnum,
    brushPreset,
    setBrushPreset
  } = useContext(ViewerContext)

  const [impassable, setImpassable] = useState(null)
  const [mining, setMining] = useState(null)

  const handleClick = () => {
    if (brushPreset == "I") {
        mapObj[x][y][0] = 'I';
        setImpassable(true);
        setMining(false);
    }
    else if (brushPreset == "T") {
        mapObj[x][y][0] = 'T';
        setImpassable(false);
        setMining(false);
    }
    else if (brushPreset == "M") {
        mapObj[x][y][0] = 'M';
        setImpassable(false);
        setMining(true);
    }
    console.log(mapObj[x][y]);
  }

  return (
    <div className={impassable ? 'tile-div grid-square color-1' : 'tile-div grid-square color-0'}
    onClick={handleClick}>
      {mining ? <img src={MetalImg} alt="" /> : <div></div>}
    </div>
  )
}
