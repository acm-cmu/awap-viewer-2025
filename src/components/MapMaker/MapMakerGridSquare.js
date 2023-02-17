import React, { useState, useContext } from "react"
import "../GridBoard/Grid.css"
import { ViewerContext } from "../../pages/MapMaker"
import MetalImg from "../../img/metal_outline.png"

export default function MapMakerGridSquare(props) {
  const { color, useImg, x, y } = props

  const {
    mapObj,
    Mnum,
    brushPreset
  } = useContext(ViewerContext)

  const [impassable, setImpassable] = useState(null)
  const [redTile, setRedTile] = useState(null)
  const [blueTile, setBlueTile] = useState(null)
  const [mining, setMining] = useState(null)

  const handleClick = () => {
    if (brushPreset == "I") {
        mapObj[x][y][0] = 'I';
        mapObj[x][y][1] = 0;
        mapObj[x][y][2] = 0;
        setImpassable(true);
        setMining(false);
        setRedTile(false);
        setBlueTile(false);
    }
    else if (brushPreset == "T") {
        mapObj[x][y][0] = 'T';
        mapObj[x][y][1] = 0;
        mapObj[x][y][2] = 0;
        setImpassable(false);
        setMining(false);
        setRedTile(false);
        setBlueTile(false);
    }
    else if (brushPreset == "M") {
        mapObj[x][y][0] = 'M';
        mapObj[x][y][1] = 0;
        if (Mnum == null) {mapObj[x][y][2] = 5;}
        else {mapObj[x][y][2] = Mnum;}
        setImpassable(false);
        setMining(true);
        setRedTile(false);
        setBlueTile(false);
    }
    else if (brushPreset == "R") {
        mapObj[x][y][0] = 'T';
        mapObj[x][y][1] = -5;
        mapObj[x][y][2] = 0;
        setImpassable(false);
        setMining(false);
        setRedTile(true);
        setBlueTile(false);
    }
    else if (brushPreset == "B") {
        mapObj[x][y][0] = 'T';
        mapObj[x][y][1] = 5;
        mapObj[x][y][2] = 0;
        setImpassable(false);
        setMining(false);
        setRedTile(false);
        setBlueTile(true);
    }
    console.log(mapObj[x][y]);
  }

  return (
    <div className={ blueTile ? "tile-div grid-square color-4" :
        redTile ? "tile-div grid-square color-3" :
        impassable ? 'tile-div grid-square color-1'
        :'tile-div grid-square color-0'}
    onClick={handleClick}>
      {mining ? <img src={MetalImg} alt="" /> : <div></div>}
    </div>
  )
}
