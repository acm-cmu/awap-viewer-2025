import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import GridBoard from "./components/GridBoard/GridBoard"
import SidePanel from "./components/SidePanel/SidePanel"
import React, { useState } from "react"

function App() {
  const [replay, setReplay] = useState(null)
  const [isPlay, setIsPlay] = useState(false)
  const [isPlayDisabled, setIsPlayDisabled] = useState(true)
  const [isP1VisToggled, setIsP1VisToggled] = useState(false)
  const [isP2VisToggled, setIsP2VisToggled] = useState(false)

  const handleFileData = (replayData) => {
    setIsPlayDisabled(false)
    setReplay(replayData)
    let root = document.documentElement
    try {
      root.style.setProperty("--cols", replayData.metadata.map_col)
      root.style.setProperty("--rows", replayData.metadata.map_row)
    } catch (err) {
      console.log(err.message)
    }
  }

  const handlePlayData = (playStatus) => {
    setIsPlay(playStatus)
  }

  const handlePlayDisabled = () => {
    setIsPlayDisabled(true)
  }

  const handleP1VisToggled = (toggleStatus) => {
    setIsP1VisToggled(toggleStatus)
  }

  const handleP2VisToggled = (toggleStatus) => {
    setIsP2VisToggled(toggleStatus)
  }

  return (
    <div className="App">
      <div className="row-structure">
        <SidePanel
          onFileData={handleFileData}
          onPlayData={handlePlayData}
          disablePlay={isPlayDisabled}
          onP1VisToggled={handleP1VisToggled}
          onP2VisToggled={handleP2VisToggled}
        />
        {replay != null ? (
          <GridBoard
            replayData={replay}
            isPlay={isPlay}
            onPlayDisabled={handlePlayDisabled}
            isP1VisToggled={isP1VisToggled}
            isP2VisToggled={isP2VisToggled}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
