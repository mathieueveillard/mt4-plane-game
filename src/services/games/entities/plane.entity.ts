import {CommandsGameInterface} from "../../../interfaces/commands.game.interface";
import BulletEntity from "./bullet.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import ParticleEntity from "./particle.entity";
import {ParticleEntityTypeEnum} from "../../../enums/games/entities/particle.entity.enum";

class PlaneEntity {
  public position: PositionGame
  public rotation: number = 0
  public lives: number = 3

  public readonly radius: number = 30

  private velocity: VelocityGame = new VelocityGame({x: 0, y: 0})
  private delete: boolean = false
  private bullets: number = 5
  private lastShot: number = 0

  private readonly speed: number = 0.15
  private readonly speedMinimum: number = 0.03
  private readonly inertia: number = 0.985
  private readonly rotationSpeed: number = 1.7
  private readonly game: MainGame

  constructor({game, position}: { game: MainGame, position: PositionGame }) {
    this.position = new PositionGame(position)

    this.game = game
  }

  public destroy() {
    this.delete = true;

    for (let idx = 0; idx < 100; idx++) {
      const particle = new ParticleEntity({
        game: this.game,
        plane: this,
        particle: {type: ParticleEntityTypeEnum.EXPLODE}
      })
      this.game.particles.push(particle)
    }
  }

  public impact() {
    for (let idx = 0; idx < 10; idx++) {
      const particle = new ParticleEntity({game: this.game, plane: this, particle: {type: ParticleEntityTypeEnum.IMPACT}})
      this.game.particles.push(particle)
    }

    this.lives -= 1
  }

  public move(planeInstructions: CommandsGameInterface) {

    if (planeInstructions.up) {
      this.accelerate(this.speed);
    } else {
      this.accelerate(this.speedMinimum);
    }

    if (planeInstructions.left) {
      this.rotation -= this.rotationSpeed;
    }
    if (planeInstructions.right) {
      this.rotation += this.rotationSpeed;
    }

    const dateNow = Date.now()
    if (planeInstructions.space && dateNow - this.lastShot > 300) {
      this.game.bullets.push(new BulletEntity({game: this.game, plane: this}))
      this.lastShot = dateNow
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    this.screenEdge()
  }

  /**
   * Rotate point around center on certain angle
   * @param position PositionGame
   * @param center PositionGame
   * @param angle angle
   */
  public rotatePoint(position: PositionGame, center: PositionGame, angle: number): PositionGame {
    return {
      x: ((position.x - center.x) * Math.cos(angle) - (position.y - center.y) * Math.sin(angle)) + center.x,
      y: ((position.x - center.x) * Math.sin(angle) + (position.y - center.y) * Math.cos(angle)) + center.y
    };
  };

  public render() {
    const context: CanvasRenderingContext2D = this.game.getContext()

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#ffffff';
    context.fillStyle = '#ffffff';
    context.lineWidth = 2;
    context.beginPath();

    context.moveTo(0, -15);

    // Propeller
    context.fillRect(-5, -12, 10, 1);
    context.fillRect(-1.5, -13, 3, 5);
    // Body
    context.fillRect(-2.5, -10, 5, 35);
    // Wing
    context.fillRect(-20, -5, 40, 10);
    // Aileron
    context.fillRect(-7.5, 20, 15, 2.5);

    context.closePath();
    context.fill();
    context.stroke();
    context.restore();
  }

  private accelerate(speed: number) {
    this.velocity.x -= Math.sin(-this.rotation * Math.PI / 180) * speed;
    this.velocity.y -= Math.cos(-this.rotation * Math.PI / 180) * speed;

    this.getTrail()
  }

  private getTrail() {
    const particle = new ParticleEntity({game: this.game, plane: this, particle: {type: ParticleEntityTypeEnum.TRAIL}})
    this.game.particles.push(particle)
  }

  private screenEdge() {
    const {width, height} = this.game.getCanvasSize()

    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }

    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }
}

export default PlaneEntity
