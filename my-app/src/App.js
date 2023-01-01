import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import GridBoard from './components/GridBoard/GridBoard'
import SidePanel from './components/SidePanel/SidePanel'
import React, {useState} from 'react';

function App() {
  const [replay, setReplay] = useState(null)
  const [isPlay, setIsPlay] = useState(false)

  const handleFileData = (replayData) => {
    setReplay(replayData)
  }

  const handlePlayData = (playStatus) => {
    setIsPlay(playStatus)
  }
  
  return (
    <div className="App">
      <div className="row-structure">
        <GridBoard nrows="32" ncols="32" replayData={replay} isPlay={isPlay}/>
        <SidePanel onFileData={handleFileData} onPlayData={handlePlayData}/>
      </div>
    </div>
  );
}

export default App;

