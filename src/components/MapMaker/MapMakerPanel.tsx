import React, { useContext } from 'react';

import { ViewerContext } from '../../pages/MapMaker.js';

import './MapMakerPanel.css';

import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Grid from '@mui/material/Grid';

import ToggleSwitch from '../ToggleSwitch/ToggleSwitch.js';

export default function MapMakerPanel({ togglePage }) {
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
    setRsym,
  } = useContext(ViewerContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    setShowMap(true);
  };

  const downloadMap = () => {
    if (mapObj && showMap) {
      const fileName = 'map.txt';
      const data = new Blob([JSON.stringify(mapObj)], { type: 'text/json' });
      const jsonURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      document.body.appendChild(link);
      link.href = jsonURL;
      link.setAttribute('download', fileName);
      link.click();
      document.body.removeChild(link);
    }
  };

  function resetMap() {
    setShowMap(false);
  }

  const handleBrushRadio = (event) => {
    setBrushPreset(event.target.value);
  };

  const handleToggleHSym = (event) => {
    setHsym(!Hsym);
  };
  const handleToggleVSym = (event) => {
    setVsym(!Vsym);
  };
  const handleToggleRSym = (event) => {
    setRsym(!Rsym);
  };

  return (
    <div className="side-panel">
      <button style={{ position: 'absolute', top: 0, right: 10, zIndex: 10 }} onClick={togglePage}>
        <SwapHorizIcon />
      </button>
      <h1 style={{ marginTop: 18, marginBottom: 0 }}>AWAP 2025</h1>
      <h2 style={{ marginTop: 0, marginBottom: 18 }}>Map Maker</h2>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" alignItems="center">
          <Grid container direction="row" justifyContent="center">
            <label>
              Rows:
              <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
            </label>
            <label>
              Cols:
              <input type="number" value={cols} onChange={(e) => setCols(e.target.value)} />
            </label>
          </Grid>
          <Grid container direction="row" justifyContent="center">
            <input type="submit" value="Init Grid" />
            <button onClick={resetMap}>Reset Grid</button>
          </Grid>
        </Grid>
      </form>

      <h2>Brush Settings:</h2>
      <Grid container className="radio-container" direction="column">
        <Grid container direction="row" alignItems="center">
          <input type="radio" value="G" name="brush" onChange={handleBrushRadio} />
          <label>Grass</label>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="I" name="brush" onChange={handleBrushRadio} />
          <label>Impassible</label>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="BC" name="brush" onChange={handleBrushRadio} />
          <label>Blue Castle</label>
        </Grid>

        <Grid container direction="row" alignItems="center">
          <input type="radio" value="RC" name="brush" onChange={handleBrushRadio} />
          <label>Red Castle</label>
        </Grid>

        {/* <Grid container direction="row" alignItems="center">
          <input type="radio" value="M" name="brush" onChange={handleBrushRadio} />
          <label>Mining</label>
          <input class="num-input" type="number" placeholder="5" min="5" max="25"
            onChange={(e) => setMnum(parseInt(e.target.value))} />
        </Grid> */}
      </Grid>

      <Grid container className="switches" direction="column">
        <Grid container direction="row" alignItems="center">
          <ToggleSwitch onToggle={handleToggleHSym} useID="hsym" disabled={!showMap}>
            <p>Horizontal Symmetry</p>
          </ToggleSwitch>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <ToggleSwitch onToggle={handleToggleVSym} useID="vsym" disabled={!showMap}>
            <p>Vertical Symmetry</p>
          </ToggleSwitch>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <ToggleSwitch onToggle={handleToggleRSym} useID="rsym" disabled={!showMap}>
            <p>Rotational Symmetry</p>
          </ToggleSwitch>
        </Grid>
      </Grid>

      <button onClick={downloadMap}>Download Map</button>
    </div>
  );
}
