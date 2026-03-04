import {ShipBodyData} from "./ShipBodyData.ts";

export type EnemyShipsData = {
  [key: string]: EnemyShipData;
}

export type EnemyShipData = {
  movementSpeed: number;
  texture: string;
  body: ShipBodyData;
  shootingRadius: number;
  bulletNumber: number;
}