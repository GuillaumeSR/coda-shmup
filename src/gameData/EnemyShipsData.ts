import {ShipBodyData} from "./ShipBodyData.ts";
import {ShipFrameData} from "./ShipFrameData.ts";

export type EnemyShipsData = {
  [key: string]: EnemyShipData;
}

export type EnemyShipData = {
  movementSpeed: number;
  specialMovement: string;
  texture: string;
  shootAnimation: ShipFrameData;
  body: ShipBodyData;
  amplitude: number;
  duration: number;
  shootingRadius: number;
  bulletNumber: number;
}