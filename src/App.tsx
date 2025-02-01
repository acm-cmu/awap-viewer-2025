import React from "react"
import "./App.css"
import Viewer from "./pages/Viewer"
import MapMaker from "./pages/MapMaker"

function App() {
  const [page, setPage] = React.useState<"viewer" | "mapmaker">("viewer")

  const togglePage = () => {
    if(page === "viewer") setPage("mapmaker")
    else if(page === "mapmaker") setPage("viewer")
  }

  if(page === "viewer") {
    return (
      <div className="App">
        <Viewer togglePage={togglePage} />
      </div>
    )
  }
  
    return (
      <div className="App">
        <MapMaker togglePage={togglePage} />
      </div>
    )
}

export default App
