import React, {useState, useEffect} from 'react';
import GridSquare from './GridSquare'
import './Grid.css'

export default function GridBoard(props) {
    const nrows = props.nrows
    const ncols = props.ncols
    const replay_object = props.replayData
    // Generate sample change array
    const coords = []
    let c = 0
    for (let i = 0; i < 250; i++) {
        coords.push([])
        for (let j = 0; j < 32; j++) {
            coords[i].push([(0 + c) % 32, j])
        }
        c += 1
    }

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
    const [intervalID, setIntervalID] = useState(null)

    useEffect(() => {
        console.log("index" + index)
        if (index >= coords.length) {
            console.log("Clearing interval with ID " + intervalID)
            clearInterval(intervalID)
            return
        }
        let turn = coords[index]
        // Create a copy of the initial grid
        const nextGrid = grid.map((row, i) => {
            return(
                row.map((elem, j) => {
                    return <GridSquare key={`${j}${i}`} color="0" />
                })
            )
        })
        // Modify grid based on changes
        for (let change of turn) {
            let x = change[0]
            let y = change[1]
            nextGrid[y][x] = <GridSquare key={`${x}${y}`} color="1" />
        }
        setGrid(nextGrid)
    }, [index])

    let iterateFrames = () => {
        setIndex((index) => index + 1)
    }

    let runAnimation = () => {
        console.log("Running animation...")
        if (!intervalID) {
            const intID = setInterval(iterateFrames, 50)
            setIntervalID(intID)
        }
    }

    // The components generated in makeGrid are rendered in div.grid-board
      return (
        <div>
            <button id="start" onClick={runAnimation}>Start</button>
            <div className='grid-board'>
                {grid}
            </div>
        </div>
      )
  }