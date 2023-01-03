import React, { useState, useEffect, useMemo, useRef } from "react"
import GridSquare from "./GridSquare"
import "./Grid.css"
import ExplorerImg from "../../img/circle.png"
// import TerraformerImg from "../../img/square.png"

export default function GridBoard(props) {
  const isPlay = props.isPlay
  const disablePlay = props.onPlayDisabled
  const replay_object = props.replayData
  const nrows = replay_object.metadata.map_row
  const ncols = replay_object.metadata.map_col
  const initImpass = replay_object.initial_map_passability
  const initMetal = replay_object.initial_map_metal
  const initTerr = replay_object.initial_map_terraformed
  const gameTurns = replay_object.turns

  const [grid, setGrid] = useState(null)
  const [robots, setRobots] = useState(null) // to display robots
  const [prevRobots, setPrevRobots] = useState({}) // dictionary mapping robot ids to coordinates
  const [index, setIndex] = useState(-1)
  const intervalID = useRef(null)

  // generates an initial array of <nrows> rows, each containing <ncols> GridSquares.
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

  // eslint-disable-next-line
  const initialRobots = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(
          <div key={`${col}${row}`} className="empty-grid-square"></div>
        )
      }
    }
    setRobots(tempArr)
    setPrevRobots({})
    return tempArr
  }, [nrows, ncols])

  // animates grid when index changes
  useEffect(() => {
    console.log("index: " + index)
    if (index >= gameTurns.length) {
      clearInterval(intervalID.current)
      intervalID.current = null
      disablePlay()
      console.log("disable play called")
      return
    } else if (index === -1) {
    } else {
      let turn = gameTurns[index]

      // Create a copy of the initial grid
      const nextGrid = grid.map((row, i) => {
        return row.map((elem, j) => {
          return elem
        })
      })
      // Modify grid

      // Create a copy of the initial robot array
      const nextRobots = robots.map((row, i) => {
        return row.map((elem, j) => {
          return elem
        })
      })

      // Modify robots
      for (let robotCh of turn.robot_changes) {
        // Remove robot at prev position if it exists
        let robotID = robotCh[0]
        if (robotID in prevRobots) {
          let xPrev = prevRobots[robotID][0]
          let yPrev = prevRobots[robotID][1]
          nextRobots[yPrev][xPrev] = (
            <div key={`${xPrev}${yPrev}`} className="empty-grid-square"></div>
          )
        }

        // Add robot at new position
        let x = robotCh[1]
        let y = robotCh[2]
        nextRobots[y][x] = (
          <div key={`${x}${y}`} className="empty-grid-square">
            <img src={ExplorerImg} alt="" />
          </div>
        )
        // Store robot coordinates
        setPrevRobots((prevRobots) => ({ ...prevRobots, [robotID]: [x, y] }))
      }

      setGrid(nextGrid)
      setRobots(nextRobots)
    }
  }, [index, gameTurns, disablePlay])

  const iterateFrames = () => {
    setIndex((index) => index + 1)
  }

  useEffect(() => {
    const runAnimation = () => {
      if (!intervalID.current) {
        intervalID.current = setInterval(iterateFrames, 500)
      }
    }
    if (isPlay) {
      runAnimation()
    } else {
      clearInterval(intervalID.current)
      intervalID.current = null
    }
  }, [isPlay])

  return (
    <div>
      <div className="board robot">{robots}</div>
      <div className="board grid">{grid}</div>
    </div>
  )
}
