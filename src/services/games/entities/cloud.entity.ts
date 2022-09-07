import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import CalculatorsApp from "../../apps/calculators.app";

class CloudEntity {
  public position: PositionGame
  public radius: number = 150
  public delete: boolean = false

  public readonly plane: PlaneEntity

  private cores: { position: PositionGame, radius: number, color: string }[] = [];
  private particles: { position: PositionGame, radius: number, color: string }[] = []
  private velocity: VelocityGame

  private readonly densityInner: number = 10
  private readonly densityOuter: number = 25
  private readonly innerRange: number = 40
  private readonly innerRadius: number = 15
  private readonly coresNumber: number = 5
  private readonly width: number = 100
  private readonly height: number = 100
  private readonly coreRadius: number = 15;
  private readonly game: MainGame

  constructor({game}: { game: MainGame }) {
    this.game = game

    const size = CalculatorsApp.randomNumberBetween(150, 300)

    this.width = size
    this.height = size
    this.radius = size / 2.5

    const {width, height} = this.game.getCanvasSize()

    this.position = new PositionGame({
      x: CalculatorsApp.randomNumberBetween(0, width),
      y: this.radius / 2,
    })

    this.velocity = new VelocityGame({
      x: CalculatorsApp.randomNumberBetween(0.1, 0.2),
      y: CalculatorsApp.randomNumberBetween(0.1, 0.2)
    })

    this.setCloudsParticlesPrimary()
    this.setCloudsParticlesCores()
    this.setCloudsParticlesOuters()

  }

  public destroy() {
    this.delete = true;
  }

  public render() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.game.isOutOfArea(this.position, this.radius)) {
      this.destroy();
    }

    const context: CanvasRenderingContext2D = this.game.getContext()

    context.save();
    context.beginPath();

    context.moveTo(0, -this.radius);

    for (const particle of this.particles) {
      context.beginPath();
      context.arc(
        this.position.x + particle.position.x - this.width / 2,
        this.position.y + particle.position.y - this.height / 2,
        particle.radius, 0,
        2 * Math.PI,
        false
      );
      context.fillStyle = particle.color;
      context.closePath();
      context.fill();
      context.closePath();
    }
    context.restore();
  }

  private outerRadius(): number {
    return Math.random() * 3 + 5
  };

  private randomSign(): number {
    return Math.floor(Math.random() * 2) * -2 + 1;
  };

  private setCloudParticle(position: PositionGame, radius: number, color?: string) {
    return {
      position,
      radius,
      color: color || "white"
    }
  }

  private setCloudsParticlesPrimary() {
    for (let idx = 0; idx < this.coresNumber; idx++) {

      const cloudParticle = this.setCloudParticle(
        {
          x: this.width / 4 + Math.random() * (this.width / 2),
          y: this.height / 4 + Math.random() * (this.height / 2)
        },
        this.coreRadius,
        'rgba(210, 210, 210, 0.1)'
      )

      this.particles.push(cloudParticle)
      this.cores.push(cloudParticle);
    }
  }

  private setCloudsParticlesCores() {
    for (const core of this.cores) {
      for (let idx = 0; idx < this.densityInner; idx++) {

        const cloudParticle = this.setCloudParticle(
          {
            x: core.position.x + this.randomSign() * Math.random() * this.innerRange,
            y: core.position.y + this.randomSign() * Math.random() * this.innerRange
          },
          this.innerRadius,
          'rgba(240, 240, 240, 0.1)'
        );

        this.particles.push(cloudParticle);
      }
    }
  }

  private setCloudsParticlesOuters() {
    const outer_particles = [];

    for (const particle of this.particles) {
      for (let idx = 0; idx < this.densityOuter; idx++) {
        const cloudParticle = this.setCloudParticle(
          {
            x: particle.position.x + this.randomSign() * Math.random() * particle.radius,
            y: particle.position.y + this.randomSign() * Math.random() * particle.radius
          },
          this.outerRadius(),
          'rgba(255, 255, 255, 0.1)'
        );

        outer_particles.push(cloudParticle);
      }
    }

    this.particles = [...this.particles, ...outer_particles];
  }
}

export default CloudEntity
