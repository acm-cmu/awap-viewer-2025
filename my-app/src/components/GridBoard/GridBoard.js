import React, { useState, useEffect, useMemo, useRef } from "react"
import GridSquare from "./GridSquare"
import "./Grid.css"

export default function GridBoard(props) {
  const replay_object = props.replayData
  const nrows = replay_object.metadata.map_row
  const ncols = replay_object.metadata.map_col
  const isPlay = props.isPlay

  // Generate sample change array
  const coords = useMemo(() => {
    let coordsTempArr = []
    let c = 0
    for (let i = 0; i < 50; i++) {
      coordsTempArr.push([])
      for (let j = 0; j < nrows; j++) {
        coordsTempArr[i].push([c % ncols, j])
      }
      c += 1
    }
    return coordsTempArr
  }, [nrows, ncols])

  const [grid, setGrid] = useState(null)
  const [index, setIndex] = useState(0)
  const intervalID = useRef(null)

  // generates an initial array of <nrows> rows, each containing <ncols> GridSquares.
  // eslint-disable-next-line
  const initialGrid = useMemo(() => {
    let tempArr = []
    for (let row = 0; row < nrows; row++) {
      tempArr.push([])
      for (let col = 0; col < ncols; col++) {
        tempArr[row].push(<GridSquare key={`${col}${row}`} color="0" />)
      }
    }
    setGrid(tempArr)
    return tempArr
  }, [nrows, ncols])

  // Modifies grid according to changes in index
  useEffect(() => {
    if (index >= coords.length) {
      clearInterval(intervalID.current)
      intervalID.current = null
      return
    }
    let turn = coords[index]
    // Create a copy of the initial grid
    const nextGrid = grid.map((row, i) => {
      return row.map((elem, j) => {
        return <GridSquare key={`${j}${i}`} color="0" />
      })
    })
    // Modify grid based on changes
    for (let change of turn) {
      let x = change[0]
      let y = change[1]
      nextGrid[y][x] = <GridSquare key={`${x}${y}`} color="1" />
    }

    setGrid(nextGrid)
    // eslint-disable-next-line
  }, [index, coords])

  const iterateFrames = () => {
    setIndex((index) => index + 1)
  }

  useEffect(() => {
    const runAnimation = () => {
      if (!intervalID.current) {
        intervalID.current = setInterval(iterateFrames, 100)
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
      <div className="grid-board">{grid}</div>
    </div>
  )
}
