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
    sliderValue,
    setSliderValue,
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
    setRedStats,
    setBlueStats,
  } = useContext(ViewerContext)

  const gameTurns = replay.replay
  const nrows = gameTurns[0].map.height
  const ncols = gameTurns[0].map.width
  const initColors = gameTurns[0].map.tiles
  const turnInfo = gameTurns[1].game_state

  document.documentElement.style.setProperty('--cols', ncols)
  document.documentElement.style.setProperty('--rows', nrows)

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [troops, setTroops] = useState(null)
  const [buildings, setBuildings] = useState(null)

  const redBuildings = turnInfo.buildings.RED[0];
  const blueBuildings = turnInfo.buildings.BLUE[0]

  // Initialize Player Stats
  setBlueStats([turnInfo.balance.BLUE, 20, blueBuildings, 0])
  setRedStats([turnInfo.balance.RED, 20, redBuildings, 0])


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

    // Set Initial Map Position
    tempArr[redBuildings.x][redBuildings.y] = <BuildSquare id={0} color="RED" type={0} />
    tempArr[blueBuildings.x][blueBuildings.y] = <BuildSquare id={0} color="BLUE" type={0} />

    setBuildings(tempArr)
    return tempArr
  }, [nrows, ncols])


  // Set Troops
  const blueTroops = turnInfo.units.BLUE;
  const redTroops = turnInfo.units.RED;

  // Initializes troops grid
  const initialTroops = useMemo(() => {
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
  }, [nrows, ncols, replay])


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

  // animates grid when index changes
  useEffect(() => {
    if (sliderValue >= gameTurns.length) {
      clearInterval(intervalID.current)
      intervalID.current = null
      setIsFinished(true)
      setMetadata([0])
      return
    } else if (sliderValue <= -1) {
    } else {
      // Updates input arrays in place
      const updateFrame = (
        i,
      ) => {
        if (i < 0) return
        // change turn
        // change coins
        // update units
        // update board (for castle & crops)
        // update fog of war
        // update currency and player status

        let turn = gameTurns[i + 1]

        // update currency 

        setBlueStats(turn.game_state.balance.BLUE)
        setRedStats(turn.game_state.balance.RED)

        setMetadata([turn.turn_number])
        if (turn.time_left === -1) {
          clearInterval(intervalID.current)
          intervalID.current = null
          setTimeout([true, null])
          setIsFinished(true)
          return
        }
      }

      var idx
      if (sliderValue === index) {
      } else if (sliderValue > index) {
        idx = index
        const newGrid = makeDeepCopy(grid)
        const newtroops = makeDeepCopy(troops)
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
        setTroops(newtroops)
      } else {
        const arr = initialGrid
        const newGrid = makeDeepCopy(arr[0])
        const newtroops = makeDeepCopy(initialTroops)
        setGrid(newGrid)
        setTroops(newtroops)
      }
      setIndex(idx)
      if (!framePlaying) {
        setIsPlay(false)
      }
    }
    // eslint-disable-next-line
  }, [sliderValue, gameTurns])

  const iterateFrames = useCallback(() => {
    setSliderValue((s) => s + 1)
  }, [setSliderValue])

  const runAnimation = useCallback(() => {
    clearInterval(intervalID.current)
    intervalID.current = null
    intervalID.current = setInterval(iterateFrames, (500 / speed) >> 0)
  }, [speed, iterateFrames])

  useEffect(() => {
    if (isPlay) {
      runAnimation()
    } else {
      clearInterval(intervalID.current)
      intervalID.current = null
    }
  }, [isPlay, setSliderValue, runAnimation])

  return (
    <div className="map">
      {isP2Vis && <div className="board visibility">{visibilityP2}</div>}
      {isP1Vis && <div className="board visibility">{visibilityP1}</div>}
      <div className="board build">{allBuildings}</div>
      <div className="board robot">{troops}</div>
      <div className="board grid">{grid}</div>
      {<MapInfoBox />}
    </div>
  )
}
