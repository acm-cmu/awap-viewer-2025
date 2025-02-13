import React from 'react';

import './Grid.css';

import Bridge from './../../assets/MapTiles/Bridge.png';
import Mountain from './../../assets/MapTiles/Mountain.png';
import Sand from './../../assets/MapTiles/Sand.png';
import Water from './../../assets/MapTiles/Water.png';

/*
  Color labels:
  0 - empty
  1 - impassable
  2 - Mountain
  3 - Water
  5 - trail (empty color)
  -#0 red
  #0 blue
*/

export enum GridSquareType {
  Grass = '0',
  Impassible = '1',
  Empty = '5',
}

export type GridSquareProps = {
  color: string;
  normalImgArray?: string[];
  blockedImgArray?: string[];
  imgIdx?: number;
};

export default function GridSquare(props: GridSquareProps) {
  const { color, normalImgArray, blockedImgArray, imgIdx } = props;
  const classes = `grid-square color-${color}`;
  let useImg: string | null | undefined = null;

  if (imgIdx != undefined) {
    switch (Number(color)) {
      case 0:
        if (!normalImgArray) break;
        useImg = normalImgArray[imgIdx];
        break;

      case 1:
        if (!blockedImgArray) break;
        useImg = blockedImgArray[imgIdx];
        break;

      case 2:
        useImg = Mountain;
        break;

      case 3:
        useImg = Water;
        break;

      case 4:
        useImg = Sand;
        break;

      case 6:
        useImg = Bridge;
        break;

      default:
        useImg = null;
        break;
    }
  }

  return (
    <div className={`tile-div ${classes}`}>
      {useImg !== null ? <img src={useImg} className="tileBgImg" alt="" /> : <div></div>}
    </div>
  );
}
