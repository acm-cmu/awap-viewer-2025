import React, { useState, useEffect, useMemo, useRef } from "react"
import GridSquare from "./GridSquare"
import "./Grid.css"

export default function GridBoard(props) {
  const nrows = props.nrows
  const ncols = props.ncols
  const replay_object = props.replayData
  const isPlay = props.isPlay

  // Generate sample change array
  const coords = useMemo(() => {
    let temp_arr = []
    let c = 0
    for (let i = 0; i < 50; i++) {
      temp_arr.push([])
      for (let j = 0; j < 32; j++) {
        temp_arr[i].push([(0 + c) % 32, j])
      }
      c += 1
    }
    return temp_arr
  }, [])

  // generates an initial array of <nrows> rows, each containing <ncols> GridSquares.
  const initialGrid = []
  for (let row = 0; row < nrows; row++) {
    initialGrid.push([])
    for (let col = 0; col < ncols; col++) {
      initialGrid[row].push(<GridSquare key={`${col}${row}`} color="0" />)
    }
  }

  const [grid, setGrid] = useState(initialGrid)
  const [index, setIndex] = useState(0)
  const intervalID = useRef(null)

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
