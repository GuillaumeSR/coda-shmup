import {Physics} from 'phaser';
import {BulletData} from "../gameData/BulletData.ts";
import Bullet from "../entities/Bullet.ts";
import Entity from "../entities/Entity.ts";
import IComponent from "./IComponent.ts";

export default class Weapon implements IComponent {
    public enabled: boolean = true;

    private readonly _bullets: Physics.Arcade.Group;
    private readonly _bulletData: BulletData;

    constructor(bullets: Physics.Arcade.Group, bulletData: BulletData) {
        if (!bullets) {
            console.error("Weapon 'bullets' group cannot be null or undefined");
        }

        this._bullets = bullets;
        this._bulletData = bulletData;
    }

    public shoot(source: Entity, count: number = 1, spread: number = 0) {
        if (!this.enabled)
            return;

        if (!this._bullets)
            return;

        const spreadInRad = Phaser.Math.DegToRad(spread);

        const startAngle = source.rotation - spreadInRad / 2;

        const step = count > 1 ? spreadInRad / (count - 1) : 0;

        for (let i = 0; i < count; i++) {
            const bullet: Bullet = this._bullets.get() as Bullet;
            if (bullet) {
                const bulletAngle = startAngle + i * step;
                const sourceForward: Phaser.Math.Vector2 = new Phaser.Math.Vector2(1, 0).rotate(bulletAngle);
                const bulletVelocity: Phaser.Math.Vector2 = sourceForward.clone().scale(this._bulletData.speed);
                bullet.enable(source.x + sourceForward.x * source.arcadeBody.radius, source.y + sourceForward.y * source.arcadeBody.radius,
                  bulletVelocity.x, bulletVelocity.y, this._bulletData);


            }
        }
    }
}