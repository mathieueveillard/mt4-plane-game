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
  public radius: number = 30

  private velocity: VelocityGame = new VelocityGame({x: 0, y: 0})
  private delete: boolean = false
  private rotationSpeed: number = 6
  private lives: number = 3
  private bullets: number = 5
  private speed: number = 0.15
  private inertia: number = 0.99
  private lastShot: number = 0

  private readonly game: MainGame

  constructor({game, position}: { game: MainGame, position: PositionGame }) {
    this.position = new PositionGame(position)

    this.game = game
  }

  accelerate() {
    this.velocity.x -= Math.sin(-this.rotation * Math.PI / 180) * this.speed;
    this.velocity.y -= Math.cos(-this.rotation * Math.PI / 180) * this.speed;

    const particle = new ParticleEntity({game: this.game, plane: this, particle: { type: ParticleEntityTypeEnum.TRAIL }})
    this.game.particles.push(particle)
  }

  destroy() {
    this.delete = true;

    for (let idx = 0; idx < 100; idx++) {
      const particle = new ParticleEntity({game: this.game, plane: this, particle: { type: ParticleEntityTypeEnum.EXPLODE }})
      this.game.particles.push(particle)
    }
  }

  move(planeInstructions: CommandsGameInterface) {
    if (planeInstructions.up) {
      this.accelerate();
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

  screenEdge() {
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

  /**
   * Rotate point around center on certain angle
   * @param position PositionGame
   * @param center PositionGame
   * @param angle angle
   */
  rotatePoint(position: PositionGame, center: PositionGame, angle: number): PositionGame {
    return {
      x: ((position.x - center.x) * Math.cos(angle) - (position.y - center.y) * Math.sin(angle)) + center.x,
      y: ((position.x - center.x) * Math.sin(angle) + (position.y - center.y) * Math.cos(angle)) + center.y
    };
  };

  render() {
    const context: CanvasRenderingContext2D = this.game.getContext()

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#ffffff';
    context.fillStyle = '#000000';
    context.lineWidth = 2;
    context.beginPath();

    context.moveTo(0, -15);

    // Propeller
    context.fillRect(-5, -12, 10, 1);
    context.fillRect(-1.5, -12, 3, 2);
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
}

export default PlaneEntity