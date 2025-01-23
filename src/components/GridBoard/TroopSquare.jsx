import React from "react"
import "./Grid.css"
import "./Troop.css"
import HealthBar from "./HealthBar"

/*
  Type labels:
  0 - red
  1 - blue
*/

export default function TroopSquare(props) {
  const { color, type, lvl, health, attack_range, damage, defense, damage_range } = props
  // const classes = `grid-square color-${-1}`
  // let useImg = null;

  // switch (Number(color)) {
  //   case 0:
  //     useImg = normalImgArray[imgIdx]
  //     break;

  //   case 1:
  //     useImg = blockedImgArray[imgIdx]
  //     break;

  //   default:
  //     useImg = null;
  //     break;
  // }
  return (
    <div className={`tile-div`}>
      {<HealthBar health={health} />}
      {<div className={`circle ${color}-${type}`}></div>}
    </div>
  )
}


// import React, { useContext, useState } from "react"
// import { ViewerContext } from "../../pages/Viewer"
// import srcImg from "../../assets/CyanTraining0.png"
// import "./Grid.css"

// export default function TroopSquare(props) {
//   const { x, y, type, hasTroop, id, team, health, damage, defense, level, attackRange, damageRange } = props
//   const { setCol, setRow, tiles } = useContext(ViewerContext)

//   const [tiletype, setTileType] = useState(null)
//   const [boldtiletype, setBoldTileType] = useState(null)
//   const [tilevisib, setTileVisib] = useState(null)
//   const [trooptype, setTroopType] = useState(null)

//   const handleHover = (row, col) => {
//     setCol(col)
//     setRow(row)
//     if (tiles != null && col != null && row != null) {
//       switch (tiles[row][col][0]) {
//         case "I":
//           setTileType("Impassable")
//           setBoldTileType("Type: ")
//           break
//         case "M":
//           setTileType("Metal " + tiles[row][col][2])
//           setBoldTileType("Type: ")
//           break
//         default:
//           setTileType(tiles[row][col][0])
//           setBoldTileType("Terr. Level: ")
//       }
//       switch (tiles[row][col][1]) {
//         case 0:
//           setTileVisib("None")
//           break
//         case 1:
//           setTileVisib("Red")
//           break
//         case 2:
//           setTileVisib("Blue")
//           break
//         default:
//           setTileVisib("Both")
//       }
//     }
//     switch (type) {
//       case "e":
//         setTroopType("Explorer")
//         break
//       case "m":
//         setTroopType("Miner")
//         break
//       case "ex":
//         setTroopType("Exploded")
//         break
//       default:
//         setTroopType("Terraformer")
//         break
//     }
//   }

//   return (
//     <div className="tile-div">
//       {hasTroop ? (
//         <div className="grid-square">
//           <img
//             id={`troop${x}${y}`}
//             src={srcImg}
//             alt=""
//             className="grid-square"
//             onMouseOver={() => {
//               handleHover(x, y)
//             }}
//             onMouseOut={() => {
//               handleHover(null, null)
//             }}
//           />
//           <p className="tooltiptext">
//             <strong> Position: </strong> ({x}, {y}) <br></br>
//             <strong> {boldtiletype} </strong> {tiletype} <br></br>
//             <strong> Visibility: </strong> {tilevisib} <br></br>
//             <strong> troop: </strong>
//             {id}, {trooptype}, {team} <br></br>
//           </p>
//         </div>
//       ) : (
//         <div
//           id={`troop${x}${y}`}
//           className="grid-square"
//           onMouseOver={() => {
//             handleHover(x, y)
//           }}
//           onMouseOut={() => {
//             handleHover(null, null)
//           }}
//         >
//           <p className="tooltiptext">
//             <strong> Position: </strong> ({x}, {y}) <br></br>
//             <strong> {boldtiletype} </strong> {tiletype} <br></br>
//             <strong> Visibility: </strong> {tilevisib} <br></br>
//           </p>
//         </div>
//       )}
//     </div>
//   )
// }
