import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
  useCallback,
} from "react"
import { ViewerContext } from "../../pages/Viewer"
import GridSquare from "./GridSquare"
import TroopSquare from "./TroopSquare"
import MapInfoBox from "./MapInfoBox"
import "./Grid.css"
import BuildSquare from "./BuildSquare"

export default function GridBoard(props) {
  const isP1Vis = props.isP1VisToggled
  const isP2Vis = props.isP2VisToggled
  const {
    replay,
    // sliderValue,
    // setSliderValue,
    isPlay,
    setIsPlay,
    framePlaying,
    setIsFinished,
    speed,
    setMetadata,
    setTimeout,
    colorKey,
    RandTileColor,
    normalImgArray,
    blockedImgArray,
    // setRedStats,
    // setBlueStats,
  } = useContext(ViewerContext)
  // setSliderValue(1)
  const gameTurns = replay.replay
  const nrows = gameTurns[0].map.height
  const ncols = gameTurns[0].map.width
  const initColors = gameTurns[0].map.tiles
  const [turnInfo, setTurnInfo] = useState(gameTurns[1].game_state)
  const [sliderValue, setSliderValue] = useState(1)
  document.documentElement.style.setProperty('--cols', ncols)
  document.documentElement.style.setProperty('--rows', nrows)

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [troops, setTroops] = useState(null)
  const [buildings, setBuildings] = useState(null)


  // need to update this to account for explosions

  const [redStats, setRedStats] = useState([turnInfo.balance.RED, 20, turnInfo.buildings.RED[0].health, 0])
  const [blueStats, setBlueStats] = useState([turnInfo.balance.BLUE, 20, turnInfo.buildings.BLUE[0].health, 0])


  // const redBuildings = turnInfo.buildings.RED[0];
  // const blueBuildings = turnInfo.buildings.BLUE[0];

  // Initialize Player Stats
  // setBlueStats([turnInfo.balance.BLUE, 20, turnInfo.buildings.BLUE[sliderValue], 0])
  // setRedStats([turnInfo.balance.RED, 20, turnInfo.buildings.RED[sliderValue], 0])


  // Initializes tile grid (unchanged during game)
  const initialGrid = useMemo(() => {
    let tempArr = []
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        let color = colorKey[initColors[row][col]];
        let randChoice = RandTileColor(color)
        tempArr[row].push(
          <GridSquare key={`${row}${col}`} color={color} imgIdx={randChoice} normalImgArray={normalImgArray} blockedImgArray={blockedImgArray} />
        )
      }
    }

    setGrid(tempArr)
    setIndex(-1)
    clearInterval(intervalID.current)
    intervalID.current = null
    return [tempArr]
  }, [nrows, ncols,])

  // Initializes buildings
  const allBuildings = useMemo(() => {
    let tempArr = []
    // Basic Map
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`b${row}${col}`}
            color="5"
          />
        )
      }
    }

    if (sliderValue < gameTurns.length - 1) {
      const redBuildings = turnInfo.buildings.RED[0];
      const blueBuildings = turnInfo.buildings.BLUE[0];

      // Set Initial Map Position
      tempArr[redBuildings.x][redBuildings.y] = <BuildSquare id={0} color="RED" type={0} />
      tempArr[blueBuildings.x][blueBuildings.y] = <BuildSquare id={0} color="BLUE" type={0} />
    } else {
      if (turnInfo.buildings.RED.length > 0) {
        const redBuildings = turnInfo.buildings.RED[0];
        tempArr[redBuildings.x][redBuildings.y] = <BuildSquare id={0} color="RED" type={0} />
      } else {
        tempArr[49][49] = <BuildSquare id={0} color="RED" type={3} />
      }
      if (turnInfo.buildings.BLUE.length > 0) {
        const blueBuildings = turnInfo.buildings.BLUE[0];
        tempArr[blueBuildings.x][blueBuildings.y] = <BuildSquare id={0} color="BLUE" type={0} />
      } else {
        tempArr[0][0] = <BuildSquare id={0} color="BLUE" type={3} />
      }
    }

    setBuildings(tempArr)
    return tempArr
  }, [nrows, ncols, turnInfo])


  // Initializes troops grid
  const initialTroops = useMemo(() => {
    // Set Troops
    const blueTroops = turnInfo.units.BLUE;
    const redTroops = turnInfo.units.RED;

    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`t${row}${col}`}
            color="5"
          />
        )
      }
    }


    // change the one at that index to be valid troopsquare
    for (let i = 0; i < blueTroops.length; i++) {
      const s = blueTroops[i];
      tempArr[s.x][s.y] = <TroopSquare key={`b${s.id}`} color={"b"} type={s.type} lvl={s.level} health={s.health} attack_range={s.attack_range} damage={s.damage} defense={s.defense} damage_range={s.damage_range} />
    }

    for (let i = 0; i < redTroops.length; i++) {
      const s = redTroops[i];
      tempArr[s.x][s.y] = <TroopSquare key={`r${s.id}`} color={"r"} type={s.type} lvl={s.level} health={s.health} attack_range={s.attack_range} damage={s.damage} defense={s.defense} damage_range={s.damage_range} />
    }

    setTroops(tempArr)
    return tempArr
  }, [nrows, ncols, turnInfo])


  const makeDeepCopy = (arr) => {
    const arrCopy = arr.map((row, i) => {
      return row.map((elem, j) => {
        return elem
      })
    })
    return arrCopy
  }

  const makeDeepCopy3D = (arr) => {
    const arrCopy = arr.map((row, i) => {
      return row.map((elemArr, j) => {
        return elemArr.map((elem, k) => {
          return elem
        })
      })
    })
    return arrCopy
  }

  const update = () => {
    console.log(sliderValue);
    if (sliderValue + 1 < gameTurns.length) {
      setTurnInfo(gameTurns[sliderValue + 1].game_state)
      setSliderValue(sliderValue + 1)
      if (turnInfo.buildings.RED.length > 0) {
        setRedStats([turnInfo.balance.RED, 20, turnInfo.buildings.RED[0].health, 0])
      } else {
        setRedStats([turnInfo.balance.RED, 20, 0, 0])
      }
      if (turnInfo.buildings.BLUE.length > 0) {
        setBlueStats([turnInfo.balance.BLUE, 20, turnInfo.buildings.BLUE[0].health, 0])
      } else {
        setBlueStats([turnInfo.balance.BLUE, 20, 0, 0])
      }
    }
  }

  return (
    <div className="map">
      <div className="board build">{allBuildings}</div>
      <div className="board robot">{troops}</div>
      <div className="board grid">{grid}</div>
      {<MapInfoBox redStats={redStats} blueStats={blueStats} />}
      <button className="updateTest" onClick={update}>update!!</button>
    </div>
  )
}
