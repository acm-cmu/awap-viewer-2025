import "./MainPage.css"
import "bootstrap/dist/css/bootstrap.min.css"
import GridBoard from "../components/GridBoard/GridBoard"
import SidePanel from "../components/SidePanel/SidePanel"
import React, { useState, createContext } from "react"
import B1 from "../assets/MapTiles/TileB1.png";
import B2 from "../assets/MapTiles/TileB2.png";
import B3 from "../assets/MapTiles/TileB3.png";
import B4 from "../assets/MapTiles/TileB4.png";
import B5 from "../assets/MapTiles/TileB5.png";

import N1 from "../assets/MapTiles/TileN1.png";
import N2 from "../assets/MapTiles/TileN2.png";
import N3 from "../assets/MapTiles/TileN3.png";
import N4 from "../assets/MapTiles/TileN4.png";
import N5 from "../assets/MapTiles/TileN5.png";



/*
  Color labels:
  0 - empty
  1 - impassable
  2 - metal
  5 - trail (empty color)
  -#0 red
  #0 blue
*/


const ViewerContext = createContext()

function Viewer({ togglePage }) {
  // for randomization of tile choice
  const colorKey = { "GRASS": "0" }
  const blockedImgCnt = 5;
  const normalImgCnt = 5;
  const blockedImgArray = [B1, B2, B3, B4, B5];
  const normalImgArray = [N1, N2, N3, N4, N5];

  const [replay, setReplay] = useState(null)
  const [metaData, setMetadata] = useState([0, "blue"])
  const [timeout, setTimeout] = useState([false, null])

  const [sliderValue, setSliderValue] = useState(-1)
  const [isPlay, setIsPlay] = useState(false)
  const [framePlaying, setFramePlaying] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [row, setRow] = useState(null)
  const [col, setCol] = useState(null)
  const [tiles, setTiles] = useState(null)

  const [frame, setFrame] = useState(null)
  const [redTroops, setRedTroops] = useState([])
  const [blueTroops, setBlueTroops] = useState([])

  const [redCastles, setRedCastles] = useState([])
  const [blueCastles, setBlueCastles] = useState([])

  const [redRobots, setRedRobots] = useState(null)
  const [blueRobots, setBlueRobots] = useState(null)

  const [isP1VisToggled, setIsP1VisToggled] = useState(false)
  const [isP2VisToggled, setIsP2VisToggled] = useState(false)
  const [isTrailToggled, setIsTrailToggled] = useState(false)

  const handleFileData = (replayData) => {
    setReplay(replayData)
    setSliderValue(-1)
    setIsDisabled(false)
    let root = document.documentElement
    try {
      root.style.setProperty("--cols", replayData[0].map.width)
      root.style.setProperty("--rows", replayData[0].map.height)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleP1VisToggled = (toggleStatus) => {
    setIsP1VisToggled(toggleStatus)
  }

  const handleP2VisToggled = (toggleStatus) => {
    setIsP2VisToggled(toggleStatus)
  }

  // for tile choices

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function RandBlockedTile() {
    return randomInt(0, blockedImgCnt - 1);
  }

  function RandNormalTile() {
    return randomInt(0, normalImgCnt - 1);
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

  return (
    <ViewerContext.Provider
      value={{
        redTroops,
        setRedTroops,
        redRobots,
        setRedRobots,
        blueRobots,
        setBlueRobots,
        blueTroops,
        setBlueTroops,
        redCastles,
        setRedCastles,
        blueCastles,
        setBlueCastles,
        frame,
        setFrame,
        replay,
        setReplay,
        sliderValue,
        setSliderValue,
        isPlay,
        setIsPlay,
        framePlaying,
        setFramePlaying,
        isDisabled,
        setIsDisabled,
        isFinished,
        setIsFinished,
        speed,
        setSpeed,
        row,
        setRow,
        col,
        setCol,
        tiles,
        setTiles,
        isTrailToggled,
        setIsTrailToggled,
        metaData,
        setMetadata,
        timeout,
        setTimeout,
        colorKey,
        RandTileColor,
        normalImgArray,
        blockedImgArray,
      }}
    >
      <div className="MainPage">
        <div className="row-structure">
          <SidePanel
            onFileData={handleFileData}
            onP1VisToggled={handleP1VisToggled}
            onP2VisToggled={handleP2VisToggled}
            togglePage={togglePage}
          />
          {replay != null ? (
            <GridBoard
              isP1VisToggled={isP1VisToggled}
              isP2VisToggled={isP2VisToggled}
            />
          ) : null}
        </div>
      </div>
    </ViewerContext.Provider>
  )
}

export default Viewer
export { ViewerContext }
