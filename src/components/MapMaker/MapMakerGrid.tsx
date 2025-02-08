import React, { useContext, useMemo, useState } from 'react';

import { ViewerContext } from '../../pages/MapMaker.js';
import MapMakerGridSquare from './MapMakerGridSquare.js';

import './MapMakerGrid.css';

type MapMakerGridProps = {
  rows: number;
  cols: number;
  mapObj: string[][];
  setMapObj: (mapObj: string[][]) => void;
};

export default function MapMakerGrid(props: MapMakerGridProps) {
  const { rows, setRows, cols, setCols, mapObj, setMapObj } = useContext(ViewerContext);

  // States for displaying various elements
  const [grid, setGrid] = useState<React.ReactNode[][]>([]);

  // Initializes tile grid
  const initialGrid = useMemo(() => {
    const tempArr: React.ReactNode[][] = [];
    const tempMapObj: string[][] = [];

    // Passable tiles
    for (let row = 0; row < rows; row++) {
      tempArr.push([]);
      tempMapObj.push();
      for (let col = 0; col < cols; col++) {
        tempArr[row].push(<MapMakerGridSquare key={`${col}${row}`} x={row} y={col} />);

        tempMapObj[row].push('GRASS');
      }
    }

    const root = document.documentElement;
    root.style.setProperty('--rows', rows);
    root.style.setProperty('--cols', cols);

    setGrid(tempArr);
    setMapObj(tempMapObj);
    return [tempArr, tempMapObj];
  }, [cols, rows]);

  return (
    <div>
      <div className="board grid">{grid}</div>
    </div>
  );
}
