import React from 'react';

import './Grid.css';
import './Troop.css';

import HealthBar from './HealthBar';

/*
  Type labels:
  0 - red
  1 - blue
  KNIGHT 
  WARRIOR
  SWORDSMAN
  DEFENDER 
  CATAPULT
  SAILOR 
  RAIDER 
  CAPTAIN 
  GALLEY 
  EXPLORER 
  ENGINEER
*/

export enum TroopSquareType {
  'b' = 0,
  'r' = 1,
}

export type TroopSquareProps = {
  color: string;
  type: string;
  lvl: number;
  health: number;
  attack_range: number;
  damage: number;
  defense: number;
  damage_range: number;
};

export default function TroopSquare(props: TroopSquareProps) {
  const { color, type, lvl, health, attack_range, damage, defense, damage_range } = props;
  return (
    <div className={`tile-div troop-square`}>
      {<HealthBar health={health} />}
      {<img className="troop-image" src={`/TroopSquares/${type}_${color}.png`}></img>}
      <div className="troop-info">
        <div>
          <span className="bold">Color:</span> {color}
        </div>
        <div>
          <span className="bold">Type:</span> {type}
        </div>
        <div>
          <span className="bold">Level:</span> {lvl}
        </div>
        <div>
          <span className="bold">Health:</span> {health}
        </div>
        <div>
          <span className="bold">Attack Range:</span> {attack_range}
        </div>
        <div>
          <span className="bold">Damage:</span> {damage}
        </div>
        <div>
          <span className="bold">Defense:</span> {defense}
        </div>
        <div>
          <span className="bold">Damage Range:</span> {damage_range}
        </div>
      </div>
    </div>
  );
}

{
  /* <div className={`circle ${color}-${type}`}></div> */
}
