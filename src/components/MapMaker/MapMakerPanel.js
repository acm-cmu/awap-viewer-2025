import React, { useContext } from "react"
import { ViewerContext } from "../../pages/MapMaker"
import "./MapMakerPanel.css"
import Grid from "@mui/material/Grid"
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch"


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
    Mnum,
    setMnum,
    brushPreset,
    setBrushPreset,
    Hsym,
    setHsym,
    Vsym,
    setVsym,
    Rsym,
    setRsym
  } = useContext(ViewerContext)

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowMap(true);
  }

  const downloadMap = () => {
    if (mapObj && showMap) {
      const fileName = "map.awap23m";
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

  const handleToggleHSym = (event) => {
    setHsym(!Hsym);
  }
  const handleToggleVSym = (event) => {
    setVsym(!Vsym);
  }
  const handleToggleRSym = (event) => {
    setRsym(!Rsym);
  }

  return (
    <div className="side-panel">
      <h1>AWAP 2023 Map Maker</h1>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" alignItems="center">
          <Grid container direction="row" justifyContent="center">
            <label>Rows:
              <input type="number" value={rows} onChange={(e)=>setRows(e.target.value)}/>
            </label>
            <label>Cols:
              <input type="number" value={cols} onChange={(e)=>setCols(e.target.value)}/>
            </label>
          </Grid>
          <input type="submit" value="Init Grid" />
        </Grid>
      </form>

      <button onClick={resetMap}>Reset Grid</button>

      <br></br>
      <br></br>
      <h2>Brush Settings:</h2>
      <Grid container class="radio-container" direction="column">
        <Grid container direction="row" alignItems="center">
          <input type="radio" value="T" name="brush" onChange={handleBrushRadio}/>
          <label>Terraformable</label>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="I" name="brush" onChange={handleBrushRadio}/>
          <label>Impassible</label>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="M" name="brush" onChange={handleBrushRadio}/>
          <label>Mining</label>
          <input class="num-input" type="number" placeholder="5"
            onChange={(e)=>setMnum(parseInt(e.target.value))}/>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="R" name="brush" onChange={handleBrushRadio}/>
          <label>Red Tile</label>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="B" name="brush" onChange={handleBrushRadio}/>
          <label>Blue Tile</label>
        </Grid>
      </Grid>

      <Grid container class="switches" direction="column">
        <Grid container direction="row" alignItems="center">
          <ToggleSwitch
            onToggle={handleToggleHSym}
            useID="hsym"
            disabled={!showMap}
          >
            <p>Horizontal Symmetry</p>
          </ToggleSwitch>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <ToggleSwitch
            onToggle={handleToggleVSym}
            useID="vsym"
            disabled={!showMap}
          >
            <p>Vertical Symmetry</p>
          </ToggleSwitch>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <ToggleSwitch
            onToggle={handleToggleRSym}
            useID="rsym"
            disabled={!showMap}
          >
            <p>Rotational Symmetry</p>
          </ToggleSwitch>
        </Grid>
      </Grid>

      <button onClick={downloadMap}>Download Map</button>

    </div>
  )
}
