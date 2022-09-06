import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import {ParticleEntityTypeEnum} from "../../../enums/games/entities/particle.entity.enum";
import CalculatorsApp from "../../apps/calculators.app";

class ParticleEntity {
  public position: PositionGame
  public radius: number = 3

  private inertia: number = 0.98
  private velocity: VelocityGame
  private delete: boolean = false
  private lifeFrame: number = 0
  private type: ParticleEntityTypeEnum

  private readonly game: MainGame

  constructor({
                game,
                plane,
                particle
              }: { game: MainGame, plane: PlaneEntity, particle: { type: ParticleEntityTypeEnum } }) {
    switch (this.type = particle.type) {

      case ParticleEntityTypeEnum.EXPLODE: {
        this.lifeFrame = CalculatorsApp.randomNumBetween(60, 500)
        this.radius = CalculatorsApp.randomNumBetween(1, 20)

        this.position = new PositionGame({
          x: plane.position.x + CalculatorsApp.randomNumBetween(-this.radius / 4, this.radius / 4),
          y: plane.position.y + CalculatorsApp.randomNumBetween(-this.radius / 4, this.radius / 4)
        })
        this.velocity = new VelocityGame({
          x: CalculatorsApp.randomNumBetween(-1.5, 1.5),
          y: CalculatorsApp.randomNumBetween(-1.5, 1.5)
        })
        break
      }

      case ParticleEntityTypeEnum.TRAIL: {
        let posDelta = plane.rotatePoint({x: 0, y: -10}, {x: 0, y: 0}, (plane.rotation - 180) * Math.PI / 180);

        this.lifeFrame = CalculatorsApp.randomNumBetween(20, 40)

        this.position = new PositionGame({
          x: plane.position.x + posDelta.x + CalculatorsApp.randomNumBetween(-2, 2),
          y: plane.position.y + posDelta.y + CalculatorsApp.randomNumBetween(-2, 2)
        })
        this.velocity = new VelocityGame({
          x: posDelta.x / CalculatorsApp.randomNumBetween(3, 5),
          y: posDelta.y / CalculatorsApp.randomNumBetween(3, 5)
        })
        break
      }
    }

    this.game = game
  }

  destroy() {
    this.delete = true;
  }

  render() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    this.radius -= 0.1;
    if (this.radius < 0.1) {
      this.radius = 0.1;
    }

    this.lifeFrame -= 1

    if (this.lifeFrame < 0) {
      this.destroy()
    }

    const context: CanvasRenderingContext2D = this.game.getContext()

    context.save();
    context.translate(this.position.x, this.position.y);
    context.fillStyle = '#ffffff';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -this.radius);
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }
}

export default ParticleEntity
