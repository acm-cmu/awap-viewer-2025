import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useContext,
  useCallback,
} from "react"
import { AppContext } from "../../App"
import GridSquare from "./GridSquare"
import "./Grid.css"
import ExplorerImg from "../../img/ex.png"
import TerraformerImg from "../../img/te.png"
import MinerImg from "../../img/mi.png"

export default function GridBoard(props) {
  // const isPlay = props.isPlay
  const disablePlay = props.onPlayDisabled
  const isP1Vis = props.isP1VisToggled
  const isP2Vis = props.isP2VisToggled
  const { replay, sliderValue, setSliderValue, isPlay } = useContext(AppContext)

  const nrows = replay.metadata.map_row
  const ncols = replay.metadata.map_col
  const initImpass = replay.initial_map_passability
  const initMetal = replay.initial_map_metal
  const initTerr = replay.initial_map_terraformed
  const gameTurns = replay.turns

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [robots, setRobots] = useState(null)
  const prevRobots = useRef({}) // dictionary mapping robot ids to coordinates
  const [visibilityP1, setVisibilityP1] = useState(null)
  const [visibilityP2, setVisibilityP2] = useState(null)

  // Initializes tile grid
  // eslint-disable-next-line
  const initialGrid = useMemo(() => {
    let tempArr = []
    // Passable tiles
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(<GridSquare key={`${col}${row}`} color="0" />)
      }
    }

    const populateTiles = (tileArr, colorID) => {
      for (let tile of tileArr) {
        let c = tile[0]
        let r = tile[1]
        tempArr[r][c] = <GridSquare key={`${c}${r}`} color={colorID} />
      }
    }

    populateTiles(initImpass, 1)
    populateTiles(initMetal, 2)
    for (let terr_tile of initTerr) {
      let c = terr_tile[0]
      let r = terr_tile[1]
      let terrNum = terr_tile[2]
      tempArr[r][c] = (
        <GridSquare key={`${c}${r}`} color={terrNum > 0 ? 3 : 4} />
      )
    }

    setGrid(tempArr)
    setIndex(-1)
    clearInterval(intervalID.current)
    intervalID.current = null
    return tempArr
  }, [nrows, ncols, initImpass, initMetal, initTerr])

  // Initializes robot grid
  // eslint-disable-next-line
  const initialRobots = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <div key={`${col}${row}`} className="grid-square"></div>
        )
      }
    }
    setRobots(tempArr)
    prevRobots.current = {}
    return tempArr
    // eslint-disable-next-line
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
              key={`${col}${row}`}
              className={`grid-square ${player}tint`}
            ></div>
          )
        }
      }
      // Make initial terraformed tiles visible
      for (let terr_tile of initTerr) {
        let x = terr_tile[0]
        let y = terr_tile[1]
        let terrNum = terr_tile[2]
        if (
          (player === "p1" && terrNum > 0) ||
          (player === "p2" && terrNum < 0)
        ) {
          tempArr[y][x] = <div key={`${x}${y}`} className="grid-square"></div>
        }
      }
      return tempArr
    },
    [nrows, ncols, initTerr]
  )

  // eslint-disable-next-line
  const p1InitialVis = useMemo(() => {
    let p1TempArr = makeVisGrid("p1")
    setVisibilityP1(p1TempArr)
    return p1TempArr
    // eslint-disable-next-line
  }, [makeVisGrid])

  const p2InitialVis = useMemo(() => {
    let p2TempArr = makeVisGrid("p2")
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

  // animates grid when index changes
  useEffect(() => {
    console.log("sliderValue, index= " + sliderValue + ", " + index)
    if (index >= gameTurns.length) {
      clearInterval(intervalID.current)
      intervalID.current = null
      disablePlay()
      return
    } else if (index === -1) {
    } else {
      // Updates input arrays in place
      const updateFrame = (i, nextGrid, nextVisP1, nextVisP2, nextRobots) => {
        let turn = gameTurns[i]

        // Modify grid
        for (let gridCh of turn.grid_changes) {
          let x = gridCh[0]
          let y = gridCh[1]
          // Update visibility
          let visClassP1 = "grid-square p1tint"
          if (gridCh[5] === 1) visClassP1 = "grid-square"
          nextVisP1[y][x] = <div key={`${x}${y}`} className={visClassP1}></div>

          let visClassP2 = "grid-square p2tint"
          if (gridCh[4] === 1) visClassP2 = "grid-square"
          nextVisP2[y][x] = <div key={`${x}${y}`} className={visClassP2}></div>

          // Update terrformedness
          let terrNum = gridCh[6]
          let terrCol = 0
          if (terrNum > 0) {
            terrCol = 3
          } else if (terrNum < 0) {
            terrCol = 4
          }
          nextGrid[y][x] = <GridSquare key={`${x}${y}`} color={terrCol} />
        }

        // Modify robots
        for (let robotCh of turn.robot_changes) {
          // Remove robot at prev position if it exists
          let robotID = robotCh[0]
          if (robotID in prevRobots.current) {
            let xPrev = prevRobots.current[robotID][0]
            let yPrev = prevRobots.current[robotID][1]
            nextRobots[yPrev][xPrev] = (
              <div key={`${xPrev}${yPrev}`} className="grid-square"></div>
            )
          }

          // Add robot at new position
          let x = robotCh[1]
          let y = robotCh[2]
          let robotType = robotCh[3]
          let robotImg
          if (robotType === "e") robotImg = ExplorerImg
          else if (robotType === "t") robotImg = TerraformerImg
          else robotImg = MinerImg
          nextRobots[y][x] = (
            <img
              src={robotImg}
              alt=""
              key={`${x}${y}`}
              className="grid-square"
            />
          )
          // Store robot coordinates
          prevRobots.current[robotID] = [x, y]
        }
      }

      var idx
      if (sliderValue >= index) {
        idx = index
        const newGrid = makeDeepCopy(grid)
        const newVisP1 = makeDeepCopy(visibilityP1)
        const newVisP2 = makeDeepCopy(visibilityP2)
        const newRobots = makeDeepCopy(robots)
        while (idx <= sliderValue) {
          updateFrame(idx, newGrid, newVisP1, newVisP2, newRobots)
          idx += 1
        }
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
        setRobots(newRobots)
      } else {
        const newGrid = makeDeepCopy(initialGrid)
        const newVisP1 = makeDeepCopy(p1InitialVis)
        const newVisP2 = makeDeepCopy(p2InitialVis)
        const newRobots = makeDeepCopy(initialRobots)
        idx = 0
        while (idx <= sliderValue) {
          updateFrame(idx, newGrid, newVisP1, newVisP2, newRobots)
          idx += 1
        }
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
        setRobots(newRobots)
      }
      setIndex(idx - 1)
    }
    // eslint-disable-next-line
  }, [sliderValue, gameTurns, disablePlay])

  useEffect(() => {
    const iterateFrames = () => {
      setIndex((index) => index + 1)
      setSliderValue((s) => s + 1)
    }

    const runAnimation = () => {
      if (!intervalID.current) {
        intervalID.current = setInterval(iterateFrames, 1000)
      }
    }
    if (isPlay) {
      runAnimation()
    } else {
      clearInterval(intervalID.current)
      intervalID.current = null
    }
  }, [isPlay, setSliderValue])

  return (
    <div>
      {isP2Vis && <div className="board visibility">{visibilityP2}</div>}
      {isP1Vis && <div className="board visibility">{visibilityP1}</div>}
      <div className="board robot">{robots}</div>
      <div className="board grid">{grid}</div>
    </div>
  )
}
