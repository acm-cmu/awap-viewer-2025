import React from 'react'
import './Grid.css'

// Represents a grid square

export default function GridSquare(props) {
    const classes = `grid-square color-${props.color}`
    return (
        <div className={classes}>
        </div>
    )
}