import React from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Viewer from "./pages/Viewer"
// import MapMaker from './pages/MapMaker';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Viewer />} />
        {/* <Route path="/mapmaker" element={<MapMaker />} /> */}
      </Routes>
    </Router>
  )
}

export default App
