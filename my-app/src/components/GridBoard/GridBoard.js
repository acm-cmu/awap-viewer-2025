import React from 'react'
import GridSquare from './GridSquare'
import './Grid.css'

export default function GridBoard(props) {
    const nrows = props.nrows
    const ncols = props.ncols
    const replay_object = props.replayData
    // generates an array of <nrows> rows, each containing <ncols> GridSquares.
    const grid = []
    for (let row = 0; row < nrows; row++) {
        grid.push([])
        for (let col = 0; col < ncols; col++) {
            grid[row].push(<GridSquare key={`${col}${row}`} color="0" />)
        }
    }
    grid[0][1] = <GridSquare key={`${0}${1}`} color="1" />

    
    // The components generated in makeGrid are rendered in div.grid-board
      return (
          <div className='grid-board'>
                {grid}
          </div>
      )
  }