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
import troopsquare from "./troopsquare"
import TrailSquare from "./TrailSquare"
import MapInfoBox from "./MapInfoBox"
import "./Grid.css"
import ExplorerImgRed from "../../better-img/light-outline-red.PNG"
import TerraformerImgRed from "../../better-img/shovel-outline-red.PNG"
import MinerImgRed from "../../better-img/pick-outline-red.PNG"
import ExplorerImgBlue from "../../better-img/light-outline-blue.PNG"
import TerraformerImgBlue from "../../better-img/shovel-outline-blue.PNG"
import MinerImgBlue from "../../better-img/pick-outline-blue.PNG"
import TroopsImg from "../../img/Troops.png"
import ExplosionImg from "../../better-img/explosion.png"


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
    redTroops,
    blueTroops,
    setRedTroops,
    setBlueTroops,
    isTrailToggled,
    redTerraform,
    setRedTerraform,
    blueTerraform,
    setBlueTerraform,
    setBluetroops,
    setRedtroops,
    setMetadata,
    setTimeout,
  } = useContext(ViewerContext)

  const nrows = replay.map_height
  const ncols = replay.map_width
  const initImpass = replay.initial_map_passability
  const initTroops = replay.initial_map_Troops
  const initTerr = replay.initial_map_terraformed
  const initVis = replay.initial_map_visible
  const gameTurns = replay.turns

  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)
  const [troops, setTroops] = useState(null)
  const [trails, setTrails] = useState(null)
  const prevTroops = useRef({}) // dictionary mapping robot ids to coordinates
  const [visibilityP1, setVisibilityP1] = useState(null)
  const [visibilityP2, setVisibilityP2] = useState(null)
  const prevExplosions = useRef([])

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
          <GridSquare key={`${row}${col}`} color="0" useImg={null} />
        )
        tileInfo[row].push([0, 0, 0])
      }
    }

    const populateTiles = (tileArr, colorID, useImg) => {
      for (let tile of tileArr) {
        let r = tile[0]
        let c = tile[1]
        let Troopsvalue = tile[2]
        tempArr[r][c] = (
          <GridSquare key={`${r}${c}`} color={colorID} useImg={useImg} />
        )
        if (colorID === 1) {
          tileInfo[r][c][0] = "I"
        } else if (colorID === 2) {
          tileInfo[r][c][0] = "M"
          tileInfo[r][c][2] = Troopsvalue
        }
      }
    }

    populateTiles(initImpass, 1, null)
    populateTiles(initTroops, 2, TroopsImg)
    for (let terr_tile of initTerr) {
      let r = terr_tile[0]
      let c = terr_tile[1]
      let terrNum = terr_tile[2]
      if (terrNum > 10) {
        terrNum = 10
        console.log("Terraform value greater than 10")
      }
      if (terrNum < -10) {
        terrNum = -10
        console.log("Terraform value less than 10")
      }
      tempArr[r][c] = (
        <GridSquare key={`${r}${c}`} color={terrNum * 10} useImg={null} />
      )
      tileInfo[r][c][0] = terrNum
      // tileInfo[r][c][1] = terrNum > 0 ? 1 : 2
    }

    for (let vis_tile of initVis) {
      let x = vis_tile[0]
      let y = vis_tile[1]
      let pl = vis_tile[2]
      if (tileInfo[x][y][1] === 0) {
        tileInfo[x][y][1] = pl
      } else if (
        (tileInfo[x][y][1] === 1 && pl === 2) ||
        (tileInfo[x][y][1] === 2 && pl === 1)
      ) {
        tileInfo[x][y][1] = 4
      }
    }

    setGrid(tempArr)
    setTiles(tileInfo)
    setIndex(-1)
    clearInterval(intervalID.current)
    intervalID.current = null
    return [tempArr, tileInfo]
  }, [nrows, ncols, initImpass, initTroops, initTerr, setTiles, initVis])

  // Initializes robot grid
  // eslint-disable-next-line
  const initialtroops = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <troopsquare
            key={`${row}${col}`}
            x={row}
            y={col}
            hasRobot={false}
            battery={0}
          />
        )
      }
    }
    setTroops(tempArr)
    prevTroops.current = {}
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
              key={`${row}${col}`}
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
          tempArr[x][y] = <div key={`${x}${y}`} className="grid-square"></div>
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
      setMetadata([0, "blue"])
      return
    } else if (sliderValue <= -1) {
    } else {
      // Updates input arrays in place
      const updateFrame = (
        i,
        nextGrid,
        nextVisP1,
        nextVisP2,
        nexttroops,
        nextTileInfo
      ) => {
        if (i < 0) return
        let turn = gameTurns[i]
        let player = turn.team
        setMetadata([turn.turn_number, player])
        if (turn.time_left === -1) {
          clearInterval(intervalID.current)
          intervalID.current = null
          if (player === "red") setTimeout([true, "RED"])
          else setTimeout([true, "BLUE"])
          setIsFinished(true)
          return
        }

        if (player === "red") {
          //Setting Red Troops Array
          const temp = redTroops
          temp.push(turn.Troops)
          setRedTroops(temp)
          setFrame(sliderValue / 2)

          const temp2 = redTerraform
          temp2.push(turn.tiles_terraformed.length)
          setRedTerraform(temp2)
          setRedtroops(turn.num_troops)
        } else {
          //Setting Blue Troops Array
          const temp = blueTroops
          temp.push(turn.Troops)
          setBlueTroops(temp)
          setFrame((sliderValue - 1) / 2)

          const temp2 = blueTerraform
          temp2.push(turn.tiles_terraformed.length)
          setBlueTerraform(temp2)
          setBluetroops(turn.num_troops)
        }

        // Update visibility
        for (let visCh of turn.tiles_explored) {
          let x = visCh[0]
          let y = visCh[1]

          if (player === "red") {
            nextVisP1[x][y] = (
              <div key={`${x}${y}`} className="grid-square"></div>
            )
            if (nextTileInfo[x][y][1] === 1 || nextTileInfo[x][y][1] === 0) {
              nextTileInfo[x][y][1] = 1
            } else {
              nextTileInfo[x][y][1] = 3
            }
          } else {
            nextVisP2[x][y] = (
              <div key={`${x}${y}`} className="grid-square"></div>
            )
            if (nextTileInfo[x][y][1] === 2 || nextTileInfo[x][y][1] === 0) {
              nextTileInfo[x][y][1] = 2
            } else {
              nextTileInfo[x][y][1] = 3
            }
          }
        }
        // Update terrformedness
        for (let terrCh of turn.tiles_terraformed) {
          let x = terrCh[0]
          let y = terrCh[1]

          let terrNum = -1
          if (player === "blue") {
            terrNum = 1
          }
          terrNum = terrNum + nextTileInfo[x][y][0]
          if (terrNum > 10) {
            terrNum = 10
            console.log("Terraform value greater than 10")
          }
          if (terrNum < -10) {
            terrNum = -10
            console.log("Terraform value greater than 10")
          }

          nextGrid[x][y] = (
            <GridSquare key={`${x}${y}`} color={terrNum * 10} useImg={null} />
          )
          nextTileInfo[x][y][0] = terrNum
          if (y === 1 && x === 1) {
          }
        }

        // Modify troops, trails, explosions
        // Remove old explosions
        for (let oldExp of prevExplosions.current) {
          let xExp = oldExp[0]
          let yExp = oldExp[1]
          nexttroops[xExp][yExp] = (
            <troopsquare
              key={`${xExp}${yExp}`}
              x={xExp}
              y={yExp}
              hasRobot={false}
            />
          )
        }
        prevExplosions.current = []
        // Add trails
        let nextTrails = makeDeepCopy(initialTrails)
        for (let robotCh of turn.robot_changes) {
          let robotID = robotCh[0]
          if (robotID in prevTroops.current) {
            let xPrev = prevTroops.current[robotID][0]
            let yPrev = prevTroops.current[robotID][1]
            // Remove robot at prev position if it exists
            nexttroops[xPrev][yPrev] = (
              <troopsquare
                key={`${xPrev}${yPrev}`}
                x={xPrev}
                y={yPrev}
                hasRobot={false}
              />
            )
            // Add trails for prev position
            let imgPrev = prevTroops.current[robotID][2]
            nextTrails[xPrev][yPrev] = (
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
            let robotTeam = robotCh[5]
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

            nexttroops[x][y] = (
              <troopsquare
                key={`${x}${y}`}
                srcImg={robotImg}
                x={x}
                y={y}
                hasRobot={true}
                type={robotType}
                battery={battery}
                id={robotID}
                team={robotTeam}
              />
            )
            // Store robot coordinates
            prevTroops.current[robotID] = [x, y, robotImg]
          } else {
            let xPrev = prevTroops.current[robotID][0]
            let yPrev = prevTroops.current[robotID][1]
            prevExplosions.current.push([xPrev, yPrev])
            nexttroops[xPrev][yPrev] = (
              <troopsquare
                key={`${xPrev}${yPrev}`}
                srcImg={ExplosionImg}
                x={xPrev}
                y={yPrev}
                hasRobot={true}
                type={"ex"}
                battery={"None"}
                id={"None"}
                team={"None"}
              />
            )
          }
        }
        return nextTrails
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
        const newTileInfo = makeDeepCopy3D(tiles)
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
        setTiles(newTileInfo)
      } else {
        const arr = initialGrid
        let newTrails
        const newGrid = makeDeepCopy(arr[0])
        const newVisP1 = makeDeepCopy(p1InitialVis)
        const newVisP2 = makeDeepCopy(p2InitialVis)
        const newtroops = makeDeepCopy(initialtroops)
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
        setTiles(newTileInfo)
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
