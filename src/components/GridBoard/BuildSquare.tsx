import React, { useMemo } from "react";
import "./Grid.css";
import BlueCastle from "../../assets/BlueCastle.png";
import RedCastle from "../../assets/RedCastle.png";
import Exploded from "../../assets/explosion.png";

/*
  Type labels:
  0 - main castle
  1 - Ship
  2 - Farmlands
  3 - Exploded
*/

type BuildSquareProps = {
  color: "RED" | "BLUE";
  type: 0 | 1 | 2 | 3;
};

export default function BuildSquare(props: BuildSquareProps) {
  const { color, type } = props;
  const classes = `grid-square`;
  let useImg: string | null = null;

  const currentImage = useMemo(() => {
    if (color === "RED") return RedCastle;
    if (color === "BLUE") return BlueCastle;
    return null;
  }, [color]);

  switch (type) {
    case 0:
      useImg = currentImage;
      break;
    case 3:
      useImg = Exploded;
      break;
    default:
      break;
  }

  return (
    <div className={`tile-div ${classes}`}>
      {useImg !== null ? (
        <img src={useImg} className="tileBgImg" alt="" />
      ) : (
        <div></div>
      )}
    </div>
  );
}
