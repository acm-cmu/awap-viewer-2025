import React from "react"
import "./Grid.css"

export default function GridSquare(props) {
  const { color, useImg } = props
  const classes = `grid-square color-${color}`
  return (
    <div className={`tile-div ${classes}`}>
      {useImg !== null ? <img src={useImg} alt="" /> : <div></div>}
    </div>
  )
}
