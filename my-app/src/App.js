import logo from './logo.svg';
import './App.css';
// import MapGrid from './components/MapGrid/MapGrid';
import GridBoard from './components/GridBoard/GridBoard'
import SidePanel from './components/SidePanel/SidePanel'

function App() {
  return (
    <div className="App">
      <div className="row-structure">
        <GridBoard nrows="10" ncols="10" />
        <SidePanel />
      </div>
    </div>
  );
}

export default App;
