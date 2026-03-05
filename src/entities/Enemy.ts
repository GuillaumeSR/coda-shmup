import type {BulletData} from '../gameData/BulletData.ts';
import Entity from './Entity.ts';
import Health from "../components/Health.ts";
import Movement from "../components/Movement.ts";
import Weapon from "../components/Weapon.ts";
import {EnemyShipData, EnemyShipsData} from "../gameData/EnemyShipsData.ts";

export default class Enemy extends Entity {
    private readonly _bulletData: BulletData = {
        width: 12,
        height: 12,
        color: 0xf25f5c,
        speed: 512,
        damage: 1,
    };
    private _shootTimerConfig: Phaser.Types.Time.TimerEventConfig;
    private _shootTimer: Phaser.Time.TimerEvent;
    private _enemyShipData: EnemyShipData;

    public init(bulletsGroup: Phaser.Physics.Arcade.Group) {
        this.addComponent(new Health(1, this));
        this.addComponent(new Movement());
        this.addComponent(new Weapon(bulletsGroup, this._bulletData));

        this.angle = 90;

        this._shootTimerConfig = {
            delay: Phaser.Math.Between(2000, 3000),
            callback: this.shoot,
            callbackScope: this,
            loop: true
        };
        this._shootTimer = this.scene.time.addEvent(this._shootTimerConfig);

        this.arcadeBody.setCircle(this.displayWidth / 2);
    }

    public enable(x: number, y: number) {
        this.selectEnemyShip(Phaser.Math.Between(1, 2));
        this.enableBody(true, x, y - this.displayHeight, true, true);
        this._shootTimer.reset(this._shootTimerConfig);
        this.anims.stop();
        this.setTexture('sprites', this._enemyShipData.texture);

        const health = this.getComponent(Health);
        health?.on(Health.CHANGE_EVENT, () => {
            this.setTintFill(0xffffff);

            if (health?.current == 0)
            {
                this.disableBody();
            }

            this.scene.time.delayedCall(50, () => {
                this.clearTint();

                if (health?.current == 0)
                {
                    this.disable();
                }
            });
        });

        if (this._enemyShipData.specialMovement == "sinus") {
            this.getComponent(Movement)?.moveSinusoidal(this, this._enemyShipData.amplitude, this._enemyShipData.duration)
        }

        // Restore health, in case the enemy is reused from the pool, without emitting events
        health?.heal(health!.max, false);
    }

    public disable() {
        this.stop();
        this.removeAllListeners(Phaser.Animations.Events.ANIMATION_COMPLETE);

        this.scene!.tweens.killTweensOf(this)

        this.disableBody(true, true);
        this._shootTimer.paused = true;
    }

    public selectEnemyShip(enemyShipDataId: number) {
        const enemyShipsData = this.scene.cache.json.get('enemyShips') as EnemyShipsData;
        this._enemyShipData = enemyShipsData[enemyShipDataId];

        if (!this.scene.anims.exists(this._enemyShipData.texture + '-shoot')) {
            this.scene.anims.create({
                key: this._enemyShipData.texture + '-shoot',
                frames: [
                    {key: 'sprites', frame: this._enemyShipData.texture},
                    {key: 'sprites', frame: this._enemyShipData.shootAnimation.sprite0},
                    {key: 'sprites', frame: this._enemyShipData.shootAnimation.sprite1}
                ],
                frameRate: 4,
            });
        }

        this.setTexture('sprites', this._enemyShipData.texture);
        const bodyData = this._enemyShipData.body;
        this.arcadeBody.setCircle(bodyData.radius, bodyData.offsetX, bodyData.offsetY);

        this.getComponent(Movement)?.setSpeed(this._enemyShipData.movementSpeed);
    }

    private shoot() {
        this.play(this._enemyShipData.texture + '-shoot');
        this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
            this.setTexture('sprites', this._enemyShipData.texture);

            this.getComponent(Weapon)?.shoot(this, this._enemyShipData.bulletNumber, this._enemyShipData.spreadAngle);
            this.scene.sound.play('sfx_laser2');
        });
    }

    preUpdate(timeSinceLaunch: number, deltaTime: number) {
        super.preUpdate(timeSinceLaunch, deltaTime)

        // Destroy entities when out of screen
        if (this.y > this.scene.cameras.main.height + this.displayHeight) {
            this.disable();
        }

        if (!this.isTinted)
            this.getComponent(Movement)?.moveVertically(this, deltaTime);
        else
            this.getComponent(Movement)?.moveVertically(this, deltaTime * 0.5);
    }
}