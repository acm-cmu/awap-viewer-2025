import "./MainPage.css"
import "bootstrap/dist/css/bootstrap.min.css"
import GridBoard from "../components/GridBoard/GridBoard"
import SidePanel from "../components/SidePanel/SidePanel"
import React, { useState, createContext } from "react"

const ViewerContext = createContext()

function Viewer() {
  const [replay, setReplay] = useState(null)
  const [sliderValue, setSliderValue] = useState(-1)
  const [isPlay, setIsPlay] = useState(false)
  const [framePlaying, setFramePlaying] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [xCoord, setXCoord] = useState(null)
  const [yCoord, setYCoord] = useState(null)

  const [isP1VisToggled, setIsP1VisToggled] = useState(false)
  const [isP2VisToggled, setIsP2VisToggled] = useState(false)

  const handleFileData = (replayData) => {
    setReplay(replayData)
    setSliderValue(-1)
    setIsDisabled(false)
    let root = document.documentElement
    try {
      root.style.setProperty("--cols", replayData.metadata.map_col)
      root.style.setProperty("--rows", replayData.metadata.map_row)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handleP1VisToggled = (toggleStatus) => {
    setIsP1VisToggled(toggleStatus)
  }

  const handleP2VisToggled = (toggleStatus) => {
    setIsP2VisToggled(toggleStatus)
  }

  return (
    <ViewerContext.Provider
      value={{
        replay,
        setReplay,
        sliderValue,
        setSliderValue,
        isPlay,
        setIsPlay,
        framePlaying,
        setFramePlaying,
        isDisabled,
        setIsDisabled,
        isFinished,
        setIsFinished,
        speed,
        setSpeed,
        xCoord,
        setXCoord,
        yCoord,
        setYCoord,
      }}
    >
      <div className="MainPage">
        <div className="row-structure">
          <SidePanel
            onFileData={handleFileData}
            onP1VisToggled={handleP1VisToggled}
            onP2VisToggled={handleP2VisToggled}
          />
          {replay != null ? (
            <GridBoard
              isP1VisToggled={isP1VisToggled}
              isP2VisToggled={isP2VisToggled}
            />
          ) : null}
        </div>
      </div>
    </ViewerContext.Provider>
  )
}

export default Viewer
export { ViewerContext }
