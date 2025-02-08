import './MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { Dispatch, SetStateAction, createContext, Provider, useState } from 'react';

import B1 from '../assets/MapTiles/TileB1.png';
import B2 from '../assets/MapTiles/TileB2.png';
import B3 from '../assets/MapTiles/TileB3.png';
import B4 from '../assets/MapTiles/TileB4.png';
import B5 from '../assets/MapTiles/TileB5.png';
import N1 from '../assets/MapTiles/TileN1.png';
import N2 from '../assets/MapTiles/TileN2.png';
import N3 from '../assets/MapTiles/TileN3.png';
import N4 from '../assets/MapTiles/TileN4.png';
import N5 from '../assets/MapTiles/TileN5.png';
import GridBoard from '../components/GridBoard/GridBoard.js';
import SidePanel from '../components/SidePanel/SidePanel.js';

/*
  Color labels:
  0 - empty
  1 - impassable
  2 - metal
  5 - trail (empty color)
  -#0 red
  #0 blue
*/

interface ViewerContextTypes{
  replay: object,
  sliderValue: number,
  setSliderValue: Dispatch<SetStateAction<number>>,
  isPlay: boolean,
  setIsPlay: Dispatch<SetStateAction<boolean>>,
  framePlaying: Dispatch<SetStateAction<boolean>>,
  setIsFinished: Dispatch<SetStateAction<boolean>>,
  speed: number,
  setMetadata:  Dispatch<SetStateAction<(string | number)[]>>,
  setTimeout:  Dispatch<SetStateAction<boolean>>,
  colorKey: number,
  RandTileColor: number,
  normalImgArray: HTMLImageElement[],
  blockedImgArray: HTMLImageElement[]
};

const ViewerContext = createContext<ViewerContextTypes>({} as ViewerContextTypes);

function Viewer({ togglePage} ) {
  // for randomization of tile choice
  const colorKey = { GRASS: '0' };
  const blockedImgCnt = 5;
  const normalImgCnt = 5;
  const blockedImgArray = [B1, B2, B3, B4, B5];
  const normalImgArray = [N1, N2, N3, N4, N5];

  const [replay, setReplay] = useState(null);
  const [metaData, setMetadata] = useState([0, 'blue']);
  const [timeout, setTimeout] = useState([false, null]);

  const [sliderValue, setSliderValue] = useState(1);
  const [isPlay, setIsPlay] = useState(false);
  const [framePlaying, setFramePlaying] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [row, setRow] = useState(null);
  const [col, setCol] = useState(null);
  const [tiles, setTiles] = useState(null);

  const [frame, setFrame] = useState(null);

  const [redTroops, setRedTroops] = useState([]);
  const [blueTroops, setBlueTroops] = useState([]);

  const [redCastles, setRedCastles] = useState([]);
  const [blueCastles, setBlueCastles] = useState([]);

  // [coinAmount, maxCastleHealth, currCastleHealth, farmlands]
  const [redStats, setRedStats] = useState([0, 0, 0, 0]);
  const [blueStats, setBlueStats] = useState([0, 0, 0, 0]);

  const [isP1VisToggled, setIsP1VisToggled] = useState(false);
  const [isP2VisToggled, setIsP2VisToggled] = useState(false);
  const [isTrailToggled, setIsTrailToggled] = useState(false);

  const handleFileData = (replayData) => {
    setReplay(replayData);
    setSliderValue(1);
    setIsDisabled(false);
    const root = document.documentElement;
    try {
      root.style.setProperty('--cols', replayData[0].map.width);
      root.style.setProperty('--rows', replayData[0].map.height);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleP1VisToggled = (toggleStatus) => {
    setIsP1VisToggled(toggleStatus);
  };

  const handleP2VisToggled = (toggleStatus) => {
    setIsP2VisToggled(toggleStatus);
  };

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
        redStats,
        setRedStats,
        blueStats,
        setBlueStats,
      }}>
      <div className="MainPage">
        <div className="row-structure">
          <SidePanel onFileData={handleFileData} togglePage={togglePage} />
          {replay != null ? <GridBoard /> : null}
        </div>
      </div>
    </ViewerContext.Provider>
  );
}

export default Viewer;
export { ViewerContext };
