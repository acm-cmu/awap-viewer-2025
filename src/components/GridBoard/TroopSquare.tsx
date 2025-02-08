import React from 'react';

import './Grid.css';
import './Troop.css';

import HealthBar from './HealthBar.js';

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
  Red = 0,
  Blue = 1,
}

export type TroopSquareProps = {
  color: TroopSquareType;
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
    <div className={`tile-div`}>
      {<HealthBar health={health} />}
      {<div className={`circle ${color}-${type}`}></div>}
    </div>
  );
}
