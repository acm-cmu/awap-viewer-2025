import React, { useContext } from "react"
import { ViewerContext } from "../../pages/MapMaker"
import "../SidePanel/SidePanel.css"

export default function MapMakerPanel(props) {
  const {
    rows,
    setRows,
    cols,
    setCols,
    showMap,
    setShowMap,
    mapObj,
    setMapObj,
    Tnum,
    setTnum,
    Mnum,
    setMnum,
    brushPreset,
    setBrushPreset
  } = useContext(ViewerContext)

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowMap(true);
  }

  const downloadMap = () => {
    if (mapObj && showMap) {
      const fileName = "map.json";
      const data = new Blob([JSON.stringify(mapObj)], { type: "text/json" });
      const jsonURL = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      document.body.appendChild(link);
      link.href = jsonURL;
      link.setAttribute("download", fileName);
      link.click();
      document.body.removeChild(link);
    }
  }

  function resetMap() {
    setShowMap(false);
  }

  const handleBrushRadio = (event) => {
    setBrushPreset(event.target.value);
  }

  return (
    <div className="side-panel">
      <h1>AWAP 2023 Map Maker</h1>
      <form onSubmit={handleSubmit}>
        <label>Rows:
          <input type="number" value={rows} onChange={(e)=>setRows(e.target.value)}/>
        </label>
        <label>Cols:
          <input type="number" value={cols} onChange={(e)=>setCols(e.target.value)}/>
        </label>
        <input type="submit" />
      </form>

      <br></br>

      <button onClick={downloadMap}>Download Map</button>

      <br></br>

      <button onClick={resetMap}>Reset</button>

      <br></br>

      <input type="radio" value="T" name="brush" onChange={handleBrushRadio}/>
      <label>Terraformable</label>

      <input type="radio" value="I" name="brush" onChange={handleBrushRadio}/>
      <label>Impassible</label>

      <input type="radio" value="M" name="brush" onChange={handleBrushRadio}/>
      <label>Mining</label>

      <input type="radio" value="redFog" name="brush" onChange={handleBrushRadio}/>
      <label>Red Fog</label>

      <input type="radio" value="blueFog" name="brush" onChange={handleBrushRadio}/>
      <label>Blue Fog</label>

      <label>
        <input type="radio" value="Tnum" name="brush" onChange={handleBrushRadio}/>
        Terraform Number
        <input type="number" onChange={(e)=>setTnum(e.target.value)}/>
      </label>

      <label>
        <input type="radio" value="Mnum" name="brush" onChange={handleBrushRadio}/>
        Mining Number
        <input type="number" onChange={(e)=>setMnum(e.target.value)}/>
      </label>

    </div>
  )
}
