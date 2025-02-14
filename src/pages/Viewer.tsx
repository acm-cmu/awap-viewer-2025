import './MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { createContext, Dispatch, Provider, ReactNode, SetStateAction, useState } from 'react';

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
import GridBoard from '../components/GridBoard/GridBoard';
import SidePanel, { Replay } from '../components/SidePanel/SidePanel';

/*
  Color labels:
  0 - empty
  1 - impassable
  2 - metal
  5 - trail (empty olor)
  -#0 red
  #0 blue
*/

type ColorKeyType = {
  [key: string]: string;
};

type StatsType = [number, number, number, number];

export type TogglePageType = {
  togglePage: () => void;
};

export interface ViewerContextTypes {
  redTroops: ReactNode[];
  setRedTroops: Dispatch<SetStateAction<ReactNode[]>>;
  blueTroops: ReactNode[];
  setBlueTroops: Dispatch<SetStateAction<ReactNode[]>>;
  redCastles: ReactNode[];
  setRedCastles: Dispatch<SetStateAction<ReactNode[]>>;
  blueCastles: ReactNode[];
  setBlueCastles: Dispatch<SetStateAction<ReactNode[]>>;
  redStats: StatsType;
  setRedStats: Dispatch<SetStateAction<StatsType>>;
  blueStats: StatsType;
  setBlueStats: Dispatch<SetStateAction<StatsType>>;
  replay: Replay | null;
  setReplay: Dispatch<SetStateAction<Replay | null>>;
  sliderValue: number;
  setSliderValue: Dispatch<SetStateAction<number>>;
  isPlay: boolean;
  setIsPlay: Dispatch<SetStateAction<boolean>>;
  framePlaying: boolean;
  setFramePlaying: Dispatch<SetStateAction<boolean>>;
  timeout: (boolean | null)[];
  setTimeout: Dispatch<SetStateAction<(boolean | null)[]>>;
  colorKey: ColorKeyType;
  RandTileColor: (color: string) => number | null;
  normalImgArray: string[];
  blockedImgArray: string[];
  isFinished: boolean;
  setIsFinished: Dispatch<SetStateAction<boolean>>;
}

const ViewerContext = createContext<ViewerContextTypes | undefined>(undefined);

function Viewer({ togglePage }: TogglePageType) {
  // for randomization of tile choice
  const colorKey: ColorKeyType = { GRASS: '0', MOUNTAIN: '2', WATER: '3', SAND: '4', BRIDGE: '6' };
  const blockedImgCnt = 5;
  const normalImgCnt = 5;
  const blockedImgArray = [B1, B2, B3, B4, B5];
  const normalImgArray = [N1, N2, N3, N4, N5];

  const [replay, setReplay] = useState<Replay | null>(null);
  const [timeout, setTimeout] = useState([false, null]);

  const [sliderValue, setSliderValue] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [framePlaying, setFramePlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [redTroops, setRedTroops] = useState<ReactNode[]>([]);
  const [blueTroops, setBlueTroops] = useState<ReactNode[]>([]);

  const [redCastles, setRedCastles] = useState<ReactNode[]>([]);
  const [blueCastles, setBlueCastles] = useState<ReactNode[]>([]);

  // [coinAmount, maxCastleHealth, currCastleHealth, farmlands]
  const [redStats, setRedStats] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [blueStats, setBlueStats] = useState<[number, number, number, number]>([0, 0, 0, 0]);

  const handleFileData = (replayData: Replay) => {
    setReplay(replayData);
    setSliderValue(0);
  };

  // for tile choices

  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function RandBlockedTile() {
    return randomInt(0, blockedImgCnt - 1);
  }

  function RandNormalTile() {
    return randomInt(0, normalImgCnt - 1);
  }

  function RandTileColor(color: string) {
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
        replay,
        setReplay,
        sliderValue,
        setSliderValue,
        isPlay,
        setIsPlay,
        framePlaying,
        setFramePlaying,
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
        isFinished,
        setIsFinished,
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
