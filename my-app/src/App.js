import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import GridBoard from "./components/GridBoard/GridBoard"
import SidePanel from "./components/SidePanel/SidePanel"
import React, { useState } from "react"

function App() {
  const [replay, setReplay] = useState(null)
  const [isPlay, setIsPlay] = useState(false)
  const [isPlayDisabled, setIsPlayDisabled] = useState(true)

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

  return (
    <div className="App">
      <div className="row-structure">
        <SidePanel
          onFileData={handleFileData}
          onPlayData={handlePlayData}
          disablePlay={isPlayDisabled}
        />
        {replay != null ? (
          <GridBoard
            replayData={replay}
            isPlay={isPlay}
            onPlayDisabled={handlePlayDisabled}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App
