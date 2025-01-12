import React, {
  useState,
  useMemo,
  useContext
} from "react"
import { ViewerContext } from "../../pages/MapMaker"
import MapMakerGridSquare from "./MapMakerGridSquare"
import "./MapMakerGrid.css"

export default function MapMakerGrid(props) {
  const {
    rows,
    setRows,
    cols,
    setCols,
    mapObj,
    setMapObj
  } = useContext(ViewerContext)

  // States for displaying various elements
  const [grid, setGrid] = useState(null)

  // Initializes tile grid
  const initialGrid = useMemo(() => {
    let tempArr = []
    let tileInfo = []
    let tempMapObj = []
    // Passable tiles
    for (let row = 0; row < rows; row++) {
      tempArr.push([])
      tileInfo.push([])
      tempMapObj.push([])
      for (let col = 0; col < cols; col++) {
        tempArr[row].push(
          <MapMakerGridSquare key={`${col}${row}`} x={row} y={col} />
        )
        tileInfo[row].push([0, 0])
        tempMapObj[row].push('GRASS')
      }
    }

    let root = document.documentElement
    root.style.setProperty("--rows", rows)
    root.style.setProperty("--cols", cols)

    setGrid(tempArr)
    setMapObj(tempMapObj)
    return [tempArr, tileInfo, tempMapObj]
  }, [])

  return (
    <div>
      <div className="board grid">{grid}</div>
    </div>

  )
}
