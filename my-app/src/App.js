import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import GridBoard from './components/GridBoard/GridBoard'
import SidePanel from './components/SidePanel/SidePanel'
import React, {useState} from 'react';

function App() {
  const [replay, setReplay] = useState(null)

  let handleCallback = (replayData) => {
    setReplay(replayData)
  }
  
  return (
    <div className="App">
      <div className="row-structure">
        <GridBoard nrows="32" ncols="32" replayData={replay}/>
        <SidePanel parentCallback={handleCallback} />
      </div>
    </div>
  );
}

export default App;

