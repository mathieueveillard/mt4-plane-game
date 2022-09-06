import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import CalculatorsApp from "../../apps/calculators.app";

class CloudEntity {
  public position: PositionGame
  public radius: number = 80
  public readonly plane: PlaneEntity

  private velocity: VelocityGame
  private delete: boolean = false

  private readonly rotation: number = 0
  private readonly vertices: { x: number; y: number; }[] = this.getVertices(8, 100)
  private readonly game: MainGame

  constructor({game, position}: { game: MainGame, position: PositionGame }) {
    this.position = new PositionGame(position)

    this.velocity = new VelocityGame({
      x: CalculatorsApp.randomNumberBetween(-1.5, 1.5),
      y: CalculatorsApp.randomNumberBetween(-1.5, 1.5)
    })

    console.log(this.vertices)

    this.game = game
  }

  getVertices(count: any, rad: any) {
    let p = [];
    for (let i = 0; i < count; i++) {
      p[i] = {
        x: (-Math.sin((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad,
        y: (-Math.cos((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad
      };
    }
    return p;
  };


  destroy() {
    this.delete = true;
  }

  render() {
    // this.position.x += this.velocity.x;
    // this.position.y += this.velocity.y;

    if (this.game.isOutOfArea(this.position)) {
      this.destroy();
    }

    const context: CanvasRenderingContext2D = this.game.getContext()

    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.rotation * Math.PI / 180);
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.beginPath();
    // context.moveTo(0, -this.radius);
    for (let i = 1; i < this.vertices.length; i++) {
      // context.lineTo(this.vertices[i].x, this.vertices[i].y);

      context.arc(this.vertices[i].x, this.vertices[i].y, 20, 0, 2 * Math.PI);
    }

    context.closePath();
    context.stroke();
    context.restore();
  }
}

export default CloudEntity
