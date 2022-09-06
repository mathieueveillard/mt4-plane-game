import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";

class BulletEntity {
  public position: PositionGame
  public radius: number = 2
  public readonly plane: PlaneEntity

  private velocity: VelocityGame
  private delete: boolean = false

  private readonly rotation: number = 0
  private readonly game: MainGame

  constructor({game, plane}: { game: MainGame, plane: PlaneEntity }) {
    let posDelta = this.rotatePoint({x: 0, y: -20}, {x: 0, y: 0}, plane.rotation * Math.PI / 180);

    this.velocity = new VelocityGame({x: posDelta.x / 2, y: posDelta.y / 2})
    this.position = new PositionGame({x: plane.position.x, y: plane.position.y})

    this.rotation = plane.rotation

    this.plane = plane
    this.game = game
  }

  destroy() {
    this.delete = true;
  }

  /**
   * Rotate point around center on certain angle
   * @param {Object} p        {x: Number, y: Number}
   * @param {Object} center   {x: Number, y: Number}
   * @param {Number} angle    Angle in radians
   */
  rotatePoint(p: any, center: any, angle: any) {
    return {
      x: ((p.x - center.x) * Math.cos(angle) - (p.y - center.y) * Math.sin(angle)) + center.x,
      y: ((p.x - center.x) * Math.sin(angle) + (p.y - center.y) * Math.cos(angle)) + center.y
    };
  };

  render() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const context: CanvasRenderingContext2D = this.game.getContext()

    if (this.game.isOutOfArea(this.position)) {
      this.destroy();
    }

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.fillStyle = '#FFF';
    context.fillStyle = '#ffffff';
    context.lineWidth = 0.5;
    context.beginPath();
    context.arc(0, 0, 2, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }
}

export default BulletEntity
