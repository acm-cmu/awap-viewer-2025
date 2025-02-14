import './MainPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { createContext, Dispatch, SetStateAction, useState } from 'react';

import MapMakerGrid from '../components/MapMaker/MapMakerGrid';
import MapMakerPanel from '../components/MapMaker/MapMakerPanel';

const ViewerContext = createContext<MapMakerContext | undefined>(undefined);
export type MapMakerProps = {
  togglePage: () => void;
};

export interface MapMakerContext {
  rows: number;
  setRows: Dispatch<SetStateAction<number>>;
  cols: number;
  setCols: Dispatch<SetStateAction<number>>;
  showMap: boolean;
  setShowMap: Dispatch<SetStateAction<boolean>>;
  mapObj: string[][];
  setMapObj: Dispatch<SetStateAction<string[][]>>;
  brushPreset: string;
  setBrushPreset: Dispatch<SetStateAction<string>>;
  Hsym: boolean;
  setHsym: Dispatch<SetStateAction<boolean>>;
  Vsym: boolean;
  setVsym: Dispatch<SetStateAction<boolean>>;
  Rsym: boolean;
  setRsym: Dispatch<SetStateAction<boolean>>;
}

function MapMaker({ togglePage }: MapMakerProps) {
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapObj, setMapObj] = useState<string[][]>([]);
  const [brushPreset, setBrushPreset] = useState('G');
  const [Hsym, setHsym] = useState(false);
  const [Vsym, setVsym] = useState(false);
  const [Rsym, setRsym] = useState(false);

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
