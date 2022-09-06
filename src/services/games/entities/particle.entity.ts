import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import {ParticleEntityTypeEnum} from "../../../enums/games/entities/particle.entity.enum";
import CalculatorsApp from "../../apps/calculators.app";

class ParticleEntity {
  public position: PositionGame
  public radius: number = 3

  private velocity: VelocityGame
  private delete: boolean = false
  private lifeFrame: number = 0
  private color: string = ''

  private readonly type: ParticleEntityTypeEnum
  private readonly inertia: number = 0.98
  private readonly game: MainGame
  private readonly plane: PlaneEntity

  constructor({
                game,
                plane,
                particle
              }: { game: MainGame, plane: PlaneEntity, particle: { type: ParticleEntityTypeEnum } }) {
    switch (this.type = particle.type) {

      case ParticleEntityTypeEnum.EXPLODE: {
        this.lifeFrame = CalculatorsApp.randomNumberBetween(60, 500)
        this.radius = CalculatorsApp.randomNumberBetween(1, 20)

        this.position = new PositionGame({
          x: plane.position.x + CalculatorsApp.randomNumberBetween(-this.radius / 4, this.radius / 4),
          y: plane.position.y + CalculatorsApp.randomNumberBetween(-this.radius / 4, this.radius / 4)
        })
        this.velocity = new VelocityGame({
          x: CalculatorsApp.randomNumberBetween(-1.5, 1.5),
          y: CalculatorsApp.randomNumberBetween(-1.5, 1.5)
        })
        break
      }

      case ParticleEntityTypeEnum.TRAIL: {
        let posDelta = plane.rotatePoint({x: 0, y: -22}, {x: 0, y: 0}, (plane.rotation - 180) * Math.PI / 180);

        this.lifeFrame = CalculatorsApp.randomNumberBetween(20, 40)

        this.position = new PositionGame({
          x: plane.position.x + posDelta.x + CalculatorsApp.randomNumberBetween(-2, 2),
          y: plane.position.y + posDelta.y + CalculatorsApp.randomNumberBetween(-2, 2)
        })
        this.velocity = new VelocityGame({
          x: posDelta.x / CalculatorsApp.randomNumberBetween(3, 5),
          y: posDelta.y / CalculatorsApp.randomNumberBetween(3, 5)
        })
        break
      }

      default:
        throw new Error('[ParticleEntity] Type not defined');
    }

    this.game = game
    this.plane = plane
  }

  public destroy() {
    this.delete = true;
  }

  public render() {
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

    context.fillStyle = this.getColorParticle();
    context.lineWidth = 2;


    context.beginPath();
    context.moveTo(0, -this.radius);
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }

  private getColorParticle(): string {
    if (this.color.length === 0) {
      this.color = this.getColorByType()
    }

    return this.color;
  }

  private getColorByType(): string {
    switch (this.type) {
      case ParticleEntityTypeEnum.TRAIL:
        return this.getColorTrail()


      case ParticleEntityTypeEnum.EXPLODE:
        return this.getColorExplode()

      default:
        throw new Error('[ParticleEntity] Type not defined');
    }
  }

  private getColorTrail(): string {
    switch (this.plane.lives) {

      case 0:
      case 1:
        return this.getColorTrailOneLive();

      case 2:
        return this.getColorTrailTwoLives()

      case 3:
        return this.getColorTrailThreeLives();

      default:
        throw new Error('[ParticleEntity] Plane lives not defined');
    }
  }

  private getColorTrailOneLive() {
    switch (CalculatorsApp.randomNumberBetween(0, 3, {round: true})) {
      case 0:
        return '#ec1515';

      case 1:
        return '#e86a16';

      case 2:
        return '#ff0000';

      case 3:
        return '#8a8686';

      default:
        throw new Error('[ParticleEntity] Color number not defined');
    }
  }

  private getColorTrailTwoLives() {
    switch (CalculatorsApp.randomNumberBetween(0, 3, {round: true})) {
      case 0:
        return '#b9b4b4';

      case 1:
        return '#8c8987';

      case 2:
        return '#484646';

      case 3:
        return '#8a8686';

      default:
        throw new Error('[ParticleEntity] Color number not defined');
    }
  }

  private getColorTrailThreeLives() {
    switch (CalculatorsApp.randomNumberBetween(0, 3, {round: true})) {
      case 0:
        return '#f1f1f1';

      case 1:
        return '#dad9d7';

      case 2:
        return '#f1e5e5';

      case 3:
        return '#f5f2f2';

      default:
        throw new Error('[ParticleEntity] Color number not defined');
    }
  }

  private getColorExplode(): string {
    switch (CalculatorsApp.randomNumberBetween(0, 8, {round: true})) {
      case 0:
        return '#b9b4b4';

      case 1:
        return '#8c8987';

      case 2:
        return '#484646';

      case 3:
        return '#8a8686';

      case 4:
        return '#9a8f8f';

      case 5:
        return '#737171';

      case 6:
        return '#916363';

      case 7:
        return '#934646';

      case 8:
        return '#ad4c4c';

      default:
        throw new Error('[ParticleEntity] Color number not defined');
    }
  }
}

export default ParticleEntity
