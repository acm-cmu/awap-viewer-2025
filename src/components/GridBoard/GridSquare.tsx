import React from 'react';

import './Grid.css';

/*
  Color labels:
  0 - empty
  1 - impassable
  5 - trail (empty color)
  -#0 red
  #0 blue
*/

export enum GridSquareType {
  Grass = "0",
  Impassible = "1",
  Empty = "5",
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

  if (normalImgArray&& blockedImgArray && imgIdx) {
  switch (Number(color)) {
    case 0:
      useImg = normalImgArray[imgIdx];
      break;

    case 1:
      useImg = blockedImgArray[imgIdx];
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
