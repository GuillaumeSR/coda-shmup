import Entity from "../entities/Entity.ts";
import IComponent from "./IComponent.ts";

export default class Movement implements IComponent {
    public enabled: boolean = true;

    private _speed: number = 0;

    public get speed(): number {
        return this._speed;
    }

    public constructor(speed?: number) {
        if (speed) {
            this._speed = speed;
        }
    }

    public setSpeed(speed: number) {
        this._speed = speed;
    }

    public moveHorizontally(entity: Entity, deltaTime: number) {
        if (!this.enabled)
            return;

        entity.x += this._speed * deltaTime;
    }

    public moveVertically(entity: Entity, deltaTime: number) {
        if (!this.enabled)
            return;

        entity.y += this._speed * deltaTime;
    }

    public moveSinusoidal(entity: Entity, amplitude: number, duration: number) {
        if (!this.enabled)
            return;

        entity.x -= amplitude / 2;

        entity.scene.tweens.killTweensOf(entity)

        entity.scene!.tweens.add({
            targets: entity,
            x: entity.x + amplitude,
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout'
        })
    }
}