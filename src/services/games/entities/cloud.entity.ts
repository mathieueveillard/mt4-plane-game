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

  private cores: any = [];
  private velocity: VelocityGame
  private particles: any = []

  private readonly inner_density = 10;
  private readonly outer_density = 25
  private readonly inner_range = 40;
  private readonly inner_radius = 15;
  private readonly num_cores = 5;
  private readonly width
  private readonly height
  private readonly core_radius = 15;
  private readonly game: MainGame

  constructor({game, position}: { game: MainGame, position: PositionGame }) {
    const size = CalculatorsApp.randomNumberBetween(150, 250)

    this.width = size
    this.height = size
    this.radius = size / 2.5

    this.position = new PositionGame(position)

    this.velocity = new VelocityGame({
      x: CalculatorsApp.randomNumberBetween(-0.105, 0.105),
      y: CalculatorsApp.randomNumberBetween(-0.105, 0.105)
    })

    this.setCloudsParticlesPrimary()
    this.setCloudsParticlesCores()
    this.setCloudsParticlesOuters()

    this.game = game
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
    for (let idx = 0; idx < this.num_cores; idx++) {

      const cloudParticle = this.setCloudParticle(
        {
          x: this.width / 4 + Math.random() * (this.width / 2),
          y: this.height / 4 + Math.random() * (this.height / 2)
        },
        this.core_radius,
        'rgba(210, 210, 210, 0.1)'
      )

      this.particles.push(cloudParticle)
      this.cores.push(cloudParticle);
    }
  }

  private setCloudsParticlesCores() {
    for (const core of this.cores) {
      for (let idx = 0; idx < this.inner_density; idx++) {

        const cloudParticle = this.setCloudParticle(
          {
            x: core.position.x + this.randomSign() * Math.random() * this.inner_range,
            y: core.position.y + this.randomSign() * Math.random() * this.inner_range
          },
          this.inner_radius,
          'rgba(240, 240, 240, 0.1)'
        );

        this.particles.push(cloudParticle);
      }
    }
  }

  private setCloudsParticlesOuters() {
    const outer_particles = [];

    for (const particle of this.particles) {
      for (let idx = 0; idx < this.outer_density; idx++) {
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
