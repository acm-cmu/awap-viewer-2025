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
import TrailSquare from "./TrailSquare"
import MapInfoBox from "./MapInfoBox"
import "./Grid.css"
import ExplosionImg from "../../assets/explosion.png"

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
    isTrailToggled,
    setBluetroops,
    setRedtroops,
    setMetadata,
    setTimeout,
    colorKey,
    RandTileColor,
    normalImgArray,
    blockedImgArray,
    setRedStats,
    setBlueStats,
    redStats,
    blueStats,
  } = useContext(ViewerContext)


  const nrows = replay[0].map.height
  const ncols = replay[0].map.width
  const initImpass = replay[1].game_state.building_placeable_map
  const initColors = replay[0].map.tiles
  const gameTurns = replay
  const turnInfo = gameTurns[1].game_state

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [troops, setTroops] = useState(null)
  const [trails, setTrails] = useState(null)
  const prevTroops = useRef({}) // dictionary mapping troop ids to coordinates
  const [visibilityP1, setVisibilityP1] = useState(null)
  const [visibilityP2, setVisibilityP2] = useState(null)
  const prevExplosions = useRef([])

  // Initialize Player Stats
  setBlueStats([turnInfo.balance.BLUE, 2000, turnInfo.buildings.BLUE["1"], 0])
  setRedStats([turnInfo.balance.RED, 2000, turnInfo.buildings.RED["0"], 0])


  // Initializes trails
  const initialTrails = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`${row}${col}`} color="5" useImg={null} />
        )
      }
    }
    return tempArr
  }, [nrows, ncols])

  useEffect(() => {
    setTrails(initialTrails)
  }, [initialTrails, replay])

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
  }, [nrows, ncols])

  // Initializes troops grid
  const initialTroops = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`${row}${col}`}
            color="5"
          />
        )
      }
    }
    setTroops(tempArr)
    prevTroops.current = {}
    return tempArr
  }, [nrows, ncols, replay])

  // Initializes visibility grid
  const makeVisGrid = useCallback(
    (player) => {
      let tempArr = []
      for (let row = 0; row < nrows; row++) {
        tempArr.push([])
        for (let col = 0; col < ncols; col++) {
          tempArr[row].push(
            <div
              key={`${row}${col}`}
              className={`grid-square ${player}tint`}
            ></div>
          )
        }
      }

      return tempArr
    },
    [nrows, ncols]
  )

  // init player visibility
  const p1InitialVis = useMemo(() => {
    let p1TempArr = makeVisGrid("RED")
    setVisibilityP1(p1TempArr)
    return p1TempArr
  }, [makeVisGrid])

  const p2InitialVis = useMemo(() => {
    let p2TempArr = makeVisGrid("BLUE")
    setVisibilityP2(p2TempArr)
    return p2TempArr
  }, [makeVisGrid])

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
        let newTrails
        const newGrid = makeDeepCopy(grid)
        const newVisP1 = makeDeepCopy(visibilityP1)
        const newVisP2 = makeDeepCopy(visibilityP2)
        const newtroops = makeDeepCopy(troops)
        while (idx < sliderValue) {
          newTrails = updateFrame(
            idx,
            newGrid,
            newVisP1,
            newVisP2,
            newtroops
          )
          idx += 1
        }
        setTrails(newTrails)
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
        setTroops(newtroops)
      } else {
        const arr = initialGrid
        let newTrails
        const newGrid = makeDeepCopy(arr[0])
        const newVisP1 = makeDeepCopy(p1InitialVis)
        const newVisP2 = makeDeepCopy(p2InitialVis)
        const newtroops = makeDeepCopy(initialTroops)
        const newTileInfo = makeDeepCopy3D(arr[1])
        idx = 0
        while (idx < sliderValue) {
          newTrails = updateFrame(
            idx,
            newGrid,
            newVisP1,
            newVisP2,
            newtroops,
            newTileInfo
          )
          idx += 1
        }
        setTrails(newTrails)
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
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
      <div className="board robot">{troops}</div>
      {isTrailToggled && <div className="board trail">{trails}</div>}
      <div className="board grid">{grid}</div>
      {<MapInfoBox />}
    </div>
  )
}
