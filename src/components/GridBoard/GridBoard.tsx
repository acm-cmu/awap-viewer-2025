import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ViewerContext } from '../../pages/Viewer';
import BuildSquare from './BuildSquare';
import GridSquare from './GridSquare';
import MapInfoBox from './MapInfoBox';
import TroopSquare from './TroopSquare';

import './Grid.css';

import { Slider } from '@mui/material';

import '../SidePanel/SidePanel.css';

export default function GridBoard() {
  const context = useContext(ViewerContext);

  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider');
  }

  const {
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
  } = context;
  if (!replay) {
    console.log('error with gameturns');
    return <div></div>;
  }

  const gameTurns = replay.replay;
  if (!gameTurns || !gameTurns[0] || !gameTurns[0].game_state.buildings.BLUE[0]) return <div></div>;
  const nrows = replay.map.height;
  const ncols = replay.map.width;
  const initColors = replay.map.tiles;
  const [turnInfo, setTurnInfo] = useState(gameTurns[sliderValue]!.game_state);
  const winner = replay!.winner_color;
  const numTurns = gameTurns.length - 1;
  const mapChangesIndices = replay['map-changes']['changed-turns'];
  const mapChangeTiles = replay['map-changes']['changed-maps'];
  // const { sliderValue, setSliderValue } = props
  const maxHealth = gameTurns[0].game_state.buildings.BLUE[0].health;
  document.documentElement.style.setProperty('--cols', ncols.toString());
  document.documentElement.style.setProperty('--rows', nrows.toString());

  // States for displaying various elements
  const [grid, setGrid] = useState<ReactNode[][]>([]);
  const [troops, setTroops] = useState<ReactNode[][]>([]);
  const [buildings, setBuildings] = useState<ReactNode[][]>([]);

  // need to update this to account for explosions
  if (!turnInfo.buildings.RED[0] || !turnInfo.buildings.BLUE[0]) return <div></div>;

  useEffect(() => {
    setRedStats([turnInfo.balance.RED, maxHealth, turnInfo.buildings!.RED[0]!.health, 0]);
    setBlueStats([turnInfo.balance.BLUE, maxHealth, turnInfo.buildings!.BLUE[0]!.health, 0]);
  }, [ncols, nrows]);

  // Initializes tile grid (unchanged during game)
  const initialGrid = useMemo(() => {
    const tempArr: ReactNode[][] = [];
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([] as ReactNode[]);
      for (let col = 0; col < ncols; col++) {
        if (!initColors) return <div></div>;
        const k = initColors[row]?.[col] as string;
        const color = colorKey?.[k] as string;
        let randChoice = 0;
        if (color === '0' || color == '1') {
          randChoice = RandTileColor(color)!;
        }
        if (!tempArr || !tempArr[row]) return <div></div>;
        tempArr[row]?.push(
          (
            <GridSquare
              key={`${row}${col}`}
              color={color}
              imgIdx={randChoice as number}
              normalImgArray={normalImgArray as string[]}
              blockedImgArray={blockedImgArray as string[]}
            />
          ) as ReactNode
        );
      }
    }

    setGrid(tempArr);
    return tempArr;
  }, [nrows, ncols]) as ReactNode[][];

  // Initializes buildings
  const allBuildings = useMemo(() => {
    const tempArr: ReactNode[][] = [];
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([]);
      for (let col = 0; col < ncols; col++) {
        tempArr[row]?.push(<GridSquare key={`b${row}${col}`} color="5" />);
      }
    }

    const redBuildings = turnInfo.buildings.RED;
    const blueBuildings = turnInfo.buildings.BLUE;
    if (redBuildings[0]!.health != 0) {
      tempArr[redBuildings[0]!.x]![redBuildings[0]!.y] = <BuildSquare id={`bu${0}`} color="RED" type={'0'} />;
    } else {
      tempArr[redBuildings[0]!.x]![redBuildings[0]!.y] = <BuildSquare id={`bu${0}`} color="RED" type={'3'} />;
    }
    if (blueBuildings[0]!.health != 0) {
      tempArr[blueBuildings[0]!.x]![blueBuildings[0]!.y] = (
        <BuildSquare id={`bu${1}`} color="BLUE" type={'0'} />
      );
    } else {
      tempArr[blueBuildings[0]!.x]![blueBuildings[0]!.y] = (
        <BuildSquare id={`bu${1}`} color="BLUE" type={'3'} />
      );
    }

    for (let i = 1; i < redBuildings.length; i++) {
      const currB = redBuildings[i]!;
      tempArr[currB.x]![currB.y] = (
        <BuildSquare id={`bur${currB.x}${currB.y}`} color="RED" type={currB.type} />
      );
    }

    for (let i = 1; i < blueBuildings.length; i++) {
      const currB = blueBuildings[i]!;
      tempArr[currB.x]![currB.y] = (
        <BuildSquare id={`bub${currB.x}${currB.y}`} color="BLUE" type={currB.type} />
      );
    }

    setBuildings(tempArr);
    return tempArr;
  }, [nrows, ncols]);

  // Initializes troops grid
  const initialTroops = useMemo(() => {
    // Set Troops
    const blueTroops = turnInfo.units.BLUE;
    const redTroops = turnInfo.units.RED;

    const tempArr: ReactNode[][] = [];
    for (let row = 0; row < nrows; row++) {
      tempArr.push([]);
      for (let col = 0; col < ncols; col++) {
        tempArr[row]!.push(<GridSquare key={`t${row}${col}`} color="5" />);
      }
    }

    // change the one at that index to be valid troopsquare
    for (let i = 0; i < blueTroops.length; i++) {
      const s = blueTroops[i];
      if (!s) return <div></div>;
      tempArr[s.x]![s.y] = (
        <TroopSquare
          key={`b${s.id}`}
          color={'BLUE'}
          type={s.type}
          lvl={s.level}
          health={s.health}
          attack_range={s.attack_range}
          damage={s.damage}
          defense={s.defense}
          damage_range={s.damage_range}
        />
      );
    }

    for (let i = 0; i < redTroops.length; i++) {
      const s = redTroops[i];
      if (!s) return <div></div>;
      tempArr[s.x]![s.y] = (
        <TroopSquare
          key={`r${s.id}`}
          color={'RED'}
          type={s.type}
          lvl={s.level}
          health={s.health}
          attack_range={s.attack_range}
          damage={s.damage}
          defense={s.defense}
          damage_range={s.damage_range}
        />
      );
    }

    setTroops(tempArr);
    return tempArr;
  }, [nrows, ncols]);

  useEffect(() => {
    setTurnInfo(gameTurns[sliderValue]!.game_state);

    setRedStats([turnInfo.balance.RED, maxHealth, turnInfo.buildings.RED[0]!.health, 0]);
    setBlueStats([turnInfo.balance.BLUE, maxHealth, turnInfo.buildings.BLUE[0]!.health, 0]);
    // reset troops
    const blueTroops = turnInfo.units.BLUE;
    const redTroops = turnInfo.units.RED;

    let mapChangeI = 0;
    for (let i = 0; i < mapChangesIndices.length; i++) {
      if (mapChangesIndices[mapChangeI]! <= sliderValue) {
        mapChangeI += 1;
      } else {
        break;
      }
    }
    mapChangeI -= 1;

    // want to change the map
    if (0 <= mapChangeI) {
      const tempArr: ReactNode[][] = [];
      const newTiles = mapChangeTiles[mapChangeI];
      // Basic Map
      for (let row = 0; row < nrows; row++) {
        tempArr.push([] as ReactNode[]);
        for (let col = 0; col < ncols; col++) {
          if (newTiles![row]![col] === initColors[row]![col]) {
            tempArr[row]![col] = grid[row]![col];
          } else {
            const k = newTiles![row]?.[col] as string;
            const color = colorKey?.[k] as string;
            let randChoice = 0;
            if (color === '0' || color == '1') {
              randChoice = RandTileColor(color)!;
            }
            if (!tempArr || !tempArr[row]) return;
            tempArr[row]?.push(
              (
                <GridSquare
                  key={`${row}${col}`}
                  color={color}
                  imgIdx={randChoice as number}
                  normalImgArray={normalImgArray as string[]}
                  blockedImgArray={blockedImgArray as string[]}
                />
              ) as ReactNode
            );
          }
        }
      }
      setGrid(tempArr);
    } else {
      setGrid(initialGrid);
    }

    let tempArr: ReactNode[][] = [];
    for (let row = 0; row < nrows; row++) {
      tempArr.push([]);
      for (let col = 0; col < ncols; col++) {
        tempArr[row]!.push(<GridSquare key={`t${row}${col}`} color="5" />);
      }
    }

    // change the one at that index to be valid troopsquare
    for (let i = 0; i < blueTroops.length; i++) {
      const s = blueTroops[i];
      if (!s) break;
      tempArr[s.x]![s.y] = (
        <TroopSquare
          key={`b${s.id}`}
          color={'BLUE'}
          type={s.type}
          lvl={s.level}
          health={s.health}
          attack_range={s.attack_range}
          damage={s.damage}
          defense={s.defense}
          damage_range={s.damage_range}
        />
      );
    }

    for (let i = 0; i < redTroops.length; i++) {
      const s = redTroops[i];
      if (!s) break;
      tempArr[s.x]![s.y] = (
        <TroopSquare
          key={`r${s.id}`}
          color={'RED'}
          type={s.type}
          lvl={s.level}
          health={s.health}
          attack_range={s.attack_range}
          damage={s.damage}
          defense={s.defense}
          damage_range={s.damage_range}
        />
      );
    }

    setTroops(tempArr);

    tempArr = [];
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([]);
      for (let col = 0; col < ncols; col++) {
        tempArr[row]?.push(<GridSquare key={`b${row}${col}`} color="5" />);
      }
    }

    const redBuildings = turnInfo.buildings.RED;
    const blueBuildings = turnInfo.buildings.BLUE;
    if (redBuildings[0]!.health != 0) {
      tempArr[redBuildings[0]!.x]![redBuildings[0]!.y] = <BuildSquare id={`bu${0}`} color="RED" type={'0'} />;
    } else {
      tempArr[redBuildings[0]!.x]![redBuildings[0]!.y] = <BuildSquare id={`bu${0}`} color="RED" type={'3'} />;
    }
    if (blueBuildings[0]!.health != 0) {
      tempArr[blueBuildings[0]!.x]![blueBuildings[0]!.y] = (
        <BuildSquare id={`bu${1}`} color="BLUE" type={'0'} />
      );
    } else {
      tempArr[blueBuildings[0]!.x]![blueBuildings[0]!.y] = (
        <BuildSquare id={`bu${1}`} color="BLUE" type={'3'} />
      );
    }

    for (let i = 1; i < redBuildings.length; i++) {
      const currB = redBuildings[i]!;
      tempArr[currB.x]![currB.y] = (
        <BuildSquare id={`bur${currB.x}${currB.y}`} color="RED" type={currB.type} />
      );
    }

    for (let i = 1; i < blueBuildings.length; i++) {
      const currB = blueBuildings[i]!;
      console.log(currB.type);
      tempArr[currB.x]![currB.y] = (
        <BuildSquare id={`bub${currB.x}${currB.y}`} color="BLUE" type={currB.type} />
      );
    }

    setBuildings(tempArr);
  }, [sliderValue]);

  return (
    <div className="map">
      <div className="board robot">{troops}</div>
      <div className="board build">{allBuildings}</div>
      <div className="board grid">{grid}</div>
      {<MapInfoBox redStats={redStats} blueStats={blueStats} />}
    </div>
  );
}
