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
import RobotSquare from "./RobotSquare"
import TrailSquare from "./TrailSquare"
import "./Grid.css"
import ExplorerImgRed from "../../new-img/light-outline-red.PNG"
import TerraformerImgRed from "../../new-img/shovel-outline-red.PNG"
import MinerImgRed from "../../new-img/pick-outline-red.PNG"
import ExplorerImgBlue from "../../new-img/light-outline-blue.PNG"
import TerraformerImgBlue from "../../new-img/shovel-outline-blue.PNG"
import MinerImgBlue from "../../new-img/pick-outline-blue.PNG"
import MetalImg from "../../img/metal_outline.png"

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
    setTiles,
    tiles,
    setFrame,
    redMetal,
    blueMetal,
    setRedMetal,
    setBlueMetal,
  } = useContext(ViewerContext)

  const nrows = replay.map_height
  const ncols = replay.map_width
  const initImpass = replay.initial_map_passability
  const initMetal = replay.initial_map_metal
  const initTerr = replay.initial_map_terraformed
  const initVis = replay.initial_map_visible
  const gameTurns = replay.turns

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [robots, setRobots] = useState(null)
  const [trails, setTrails] = useState(null)
  const prevRobots = useRef({}) // dictionary mapping robot ids to coordinates
  const [visibilityP1, setVisibilityP1] = useState(null)
  const [visibilityP2, setVisibilityP2] = useState(null)

  // Initializes trails
  const initialTrails = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`${col}${row}`} color="5" useImg={null} />
        )
      }
    }
    return tempArr
  }, [nrows, ncols])

  useEffect(() => {
    setTrails(initialTrails)
  }, [initialTrails, replay])

  // Initializes tile grid
  // eslint-disable-next-line
  const initialGrid = useMemo(() => {
    let tempArr = []
    let tileInfo = []
    // Passable tiles
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      tileInfo.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <GridSquare key={`${col}${row}`} color="0" useImg={null} />
        )
        tileInfo[row].push([0, 0])
      }
    }

    const populateTiles = (tileArr, colorID, useImg) => {
      for (let tile of tileArr) {
        let c = tile[0]
        let r = tile[1]
        tempArr[r][c] = (
          <GridSquare key={`${c}${r}`} color={colorID} useImg={useImg} />
        )
        if (colorID === 1) {
          tileInfo[r][c][0] = "I"
        } else if (colorID === 2) {
          tileInfo[r][c][0] = "M"
        }
      }
    }

    populateTiles(initImpass, 1, null)
    populateTiles(initMetal, 2, MetalImg)
    for (let terr_tile of initTerr) {
      let c = terr_tile[0]
      let r = terr_tile[1]
      let terrNum = terr_tile[2]
      tempArr[r][c] = (
        <GridSquare
          key={`${c}${r}`}
          color={terrNum > 0 ? 3 : 4}
          useImg={null}
        />
      )
      tileInfo[r][c][0] = terrNum
      // tileInfo[r][c][1] = terrNum > 0 ? 1 : 2
    }

    for (let vis_tile of initVis) {
      let x = vis_tile[0]
      let y = vis_tile[1]
      let pl = vis_tile[2]
      if (tileInfo[y][x][1] === 0) {
        tileInfo[y][x][1] = pl
      } else if (
        (tileInfo[y][x][1] === 1 && pl === 2) ||
        (tileInfo[y][x][1] === 2 && pl === 1)
      ) {
        tileInfo[y][x][1] = 4
      }
    }

    setGrid(tempArr)
    setTiles(tileInfo)
    setIndex(-1)
    clearInterval(intervalID.current)
    intervalID.current = null
    return [tempArr, tileInfo]
  }, [nrows, ncols, initImpass, initMetal, initTerr, initVis, setTiles])

  // Initializes robot grid
  // eslint-disable-next-line
  const initialRobots = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <RobotSquare
            key={`${col}${row}`}
            x={col}
            y={row}
            hasRobot={false}
            battery={0}
          />
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

      for (let vis_tile of initVis) {
        let x = vis_tile[0]
        let y = vis_tile[1]
        let pl = vis_tile[2]
        if ((player === "RED" && pl === 1) || (player === "BLUE" && pl === 2)) {
          tempArr[y][x] = <div key={`${x}${y}`} className="grid-square"></div>
        }
      }

      return tempArr
    },
    [nrows, ncols, initVis]
  )

  // eslint-disable-next-line
  const p1InitialVis = useMemo(() => {
    let p1TempArr = makeVisGrid("RED")
    setVisibilityP1(p1TempArr)
    return p1TempArr
    // eslint-disable-next-line
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
      return
    } else if (sliderValue <= -1) {
    } else {
      // Updates input arrays in place
      const updateFrame = (
        i,
        nextGrid,
        nextVisP1,
        nextVisP2,
        nextRobots,
        nextTileInfo
      ) => {
        if (i < 0) return
        let turn = gameTurns[i]
        let player = turn.team

        if (player === "red") {
          //Setting Red Metal Array
          const temp = redMetal
          temp.push(turn.metal)
          setRedMetal(temp)
          setFrame(sliderValue / 2)
        } else {
          //Setting Blue Metal Array
          const temp = blueMetal
          temp.push(turn.metal)
          setBlueMetal(temp)
          setFrame((sliderValue - 1) / 2)
        }

        // Update visibility
        for (let visCh of turn.tiles_explored) {
          let x = visCh[0]
          let y = visCh[1]

          if (player === "red") {
            nextVisP1[y][x] = (
              <div key={`${x}${y}`} className="grid-square"></div>
            )
            if (nextTileInfo[y][x][1] === 1 || nextTileInfo[y][x][1] === 0) {
              nextTileInfo[y][x][1] = 1
            } else {
              nextTileInfo[y][x][1] = 3
            }
          } else {
            nextVisP2[y][x] = (
              <div key={`${x}${y}`} className="grid-square"></div>
            )
            if (nextTileInfo[y][x][1] === 2 || nextTileInfo[y][x][1] === 0) {
              nextTileInfo[y][x][1] = 2
            } else {
              nextTileInfo[y][x][1] = 3
            }
          }
        }

        // Update terrformedness
        for (let terrCh of turn.tiles_terraformed) {
          let x = terrCh[0]
          let y = terrCh[1]

          let terrNum = -1
          if (player === "red") {
            terrNum = 1
          }
          terrNum = terrNum + nextTileInfo[y][x][0]

          let terrCol = 0
          if (terrNum > 0) {
            terrCol = 3
          } else if (terrNum < 0) {
            terrCol = 4
          }

          nextGrid[y][x] = (
            <GridSquare key={`${x}${y}`} color={terrCol} useImg={null} />
          )
          nextTileInfo[y][x][0] = terrNum
          if (y === 1 && x === 1) {
          }
        }

        // Modify robots and trails
        let nextTrails = makeDeepCopy(initialTrails)
        for (let robotCh of turn.robot_changes) {
          let robotID = robotCh[0]
          if (robotID in prevRobots.current) {
            let xPrev = prevRobots.current[robotID][0]
            let yPrev = prevRobots.current[robotID][1]
            // Remove robot at prev position if it exists
            nextRobots[yPrev][xPrev] = (
              <RobotSquare
                key={`${xPrev}${yPrev}`}
                x={xPrev}
                y={yPrev}
                hasRobot={false}
              />
            )
            // Add trails for prev position
            let imgPrev = prevRobots.current[robotID][2]
            nextTrails[yPrev][xPrev] = (
              <TrailSquare
                key={`${xPrev}${yPrev}`}
                srcImg={imgPrev}
                x={xPrev}
                y={yPrev}
              />
            )
          }

          // Get coordinates of robot at new position
          let x = robotCh[1]
          let y = robotCh[2]
          // Add robot at new position
          if (x !== -1 && y !== -1) {
            let robotType = robotCh[3]
            let battery = robotCh[4]
            let robotImg
            if (player === "red") {
              if (robotType === "e") robotImg = ExplorerImgRed
              else if (robotType === "t") robotImg = TerraformerImgRed
              else robotImg = MinerImgRed
            } else {
              if (robotType === "e") robotImg = ExplorerImgBlue
              else if (robotType === "t") robotImg = TerraformerImgBlue
              else robotImg = MinerImgBlue
            }

            nextRobots[y][x] = (
              <RobotSquare
                key={`${x}${y}`}
                srcImg={robotImg}
                x={x}
                y={y}
                hasRobot={true}
                type={robotType}
                battery={battery}
                id={robotID}
              />
            )
            // Store robot coordinates
            prevRobots.current[robotID] = [x, y, robotImg]
          }
        }
        return nextTrails
      }

      var idx
      if (sliderValue >= index) {
        idx = index
        let newTrails
        const newGrid = makeDeepCopy(grid)
        const newVisP1 = makeDeepCopy(visibilityP1)
        const newVisP2 = makeDeepCopy(visibilityP2)
        const newRobots = makeDeepCopy(robots)
        const newTileInfo = makeDeepCopy3D(tiles)
        while (idx <= sliderValue) {
          newTrails = updateFrame(
            idx,
            newGrid,
            newVisP1,
            newVisP2,
            newRobots,
            newTileInfo
          )
          idx += 1
        }
        setTrails(newTrails)
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
        setRobots(newRobots)
        setTiles(newTileInfo)
      } else {
        const arr = initialGrid
        let newTrails
        const newGrid = makeDeepCopy(arr[0])
        const newVisP1 = makeDeepCopy(p1InitialVis)
        const newVisP2 = makeDeepCopy(p2InitialVis)
        const newRobots = makeDeepCopy(initialRobots)
        const newTileInfo = makeDeepCopy3D(arr[1])
        idx = 0
        while (idx <= sliderValue) {
          newTrails = updateFrame(
            idx,
            newGrid,
            newVisP1,
            newVisP2,
            newRobots,
            newTileInfo
          )
          idx += 1
        }
        setTrails(newTrails)
        setGrid(newGrid)
        setVisibilityP1(newVisP1)
        setVisibilityP2(newVisP2)
        setRobots(newRobots)
        setTiles(newTileInfo)
      }
      setIndex(idx - 1)
      if (!framePlaying) {
        setIsPlay(false)
      }
    }
    // eslint-disable-next-line
  }, [sliderValue, gameTurns])

  const iterateFrames = useCallback(() => {
    setIndex((index) => index + 1)
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
    <div>
      {isP2Vis && <div className="board visibility">{visibilityP2}</div>}
      {isP1Vis && <div className="board visibility">{visibilityP1}</div>}
      <div className="board robot">{robots}</div>
      <div className="board trail">{trails}</div>
      <div className="board grid">{grid}</div>
    </div>
  )
}
