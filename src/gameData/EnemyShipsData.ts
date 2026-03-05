import {ShipBodyData} from "./ShipBodyData.ts";

export type EnemyShipsData = {
  [key: string]: EnemyShipData;
}

export type EnemyShipData = {
  movementSpeed: number;
  specialMovement: string;
  texture: string;
  body: ShipBodyData;
  amplitude: number;
  duration: number;
  shootingRadius: number;
  bulletNumber: number;
}