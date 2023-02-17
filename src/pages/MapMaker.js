import "./MainPage.css"
import "bootstrap/dist/css/bootstrap.min.css"
import MapMakerGrid from "../components/MapMaker/MapMakerGrid"
import MapMakerPanel from "../components/MapMaker/MapMakerPanel"
import React, { useState, createContext } from "react"

const ViewerContext = createContext()

function MapMaker() {
  const [rows, setRows] = useState(null)
  const [cols, setCols] = useState(null)
  const [showMap, setShowMap] = useState(null)
  const [mapObj, setMapObj] = useState(null)
  const [brushPreset, setBrushPreset] = useState(null)
  const [Mnum, setMnum] = useState(null)
  const [Hsym, setHsym] = useState(null)
  const [Vsym, setVsym] = useState(null)

  return (
    <ViewerContext.Provider
      value={{
        rows,
        setRows,
        cols,
        setCols,
        showMap,
        setShowMap,
        mapObj,
        setMapObj,
        Mnum,
        setMnum,
        brushPreset,
        setBrushPreset,
        Hsym,
        setHsym,
        Vsym,
        setVsym
      }}
    >
      <div className="MainPage">
        <div className="row-structure">
          <MapMakerPanel/>
          {showMap && rows && cols ? (
            <MapMakerGrid/>
          ) : null}
        </div>
      </div>
    </ViewerContext.Provider>
  )
}

export default MapMaker
export { ViewerContext }