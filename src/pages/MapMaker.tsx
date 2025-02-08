import './MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { createContext, useState } from 'react';

import MapMakerGrid from '../components/MapMaker/MapMakerGrid.js';
import MapMakerPanel from '../components/MapMaker/MapMakerPanel.js';

const ViewerContext = createContext({});

function MapMaker({ togglePage }) {
  const [rows, setRows] = useState(null);
  const [cols, setCols] = useState(null);
  const [showMap, setShowMap] = useState(null);
  const [mapObj, setMapObj] = useState(null);
  const [brushPreset, setBrushPreset] = useState(null);
  const [Mnum, setMnum] = useState(null);
  const [Hsym, setHsym] = useState(null);
  const [Vsym, setVsym] = useState(null);
  const [Rsym, setRsym] = useState(null);

  return (
    <ViewerContext.Provider
      value={{
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
      }}>
      <div className="MainPage">
        <div className="row-structure">
          <MapMakerPanel togglePage={togglePage} />
          {showMap && rows && cols ? <MapMakerGrid /> : null}
        </div>
      </div>
    </ViewerContext.Provider>
  );
}

export default MapMaker;
export { ViewerContext };
