import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import CalculatorsApp from "../../apps/calculators.app";

class CloudEntity {
  public position: PositionGame
  public radius: number = 150

  public readonly plane: PlaneEntity

  private cores: any = [];
  private velocity: VelocityGame
  private delete: boolean = false
  private particles: any = []
  private rotation: number = 0

  // private readonly rotationSpeed = CalculatorsApp.randomNumberBetween(-1, 1);
  private readonly rotationSpeed = 1;
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

    this.setPrimaryCloudsParticles()
    this.setCoresCloudsParticles()
    this.setCloudsParticlesOuters()

    this.game = game
  }

  outer_radius = function () {
    return Math.random() * 3 + 5
  };

  randSign() {
    return Math.floor(Math.random() * 2) * -2 + 1;
  };

  setCloudParticle(position: PositionGame, radius: number, color?: string) {
    return {
      position,
      radius,
      color: color || "white"
    }
  }

  destroy() {
    this.delete = true;
  }

  render() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;


    this.rotation += this.rotationSpeed;
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

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

  private setPrimaryCloudsParticles() {
    for (let idx = 0; idx < this.num_cores; idx++) {

      const cloudParticle = this.setCloudParticle(
        {
          x: this.width / 4 + Math.random() * (this.width / 2),
          y: this.height / 4 + Math.random() * (this.height / 2)
        },
        this.core_radius,
        'rgba(210, 210, 210, 0.5)'
      )

      this.particles.push(cloudParticle)
      this.cores.push(cloudParticle);
    }
  }

  private setCoresCloudsParticles() {
    for (const core of this.cores) {
      for (let idx = 0; idx < this.inner_density; idx++) {

        const cloudParticle = this.setCloudParticle(
          {
            x: core.position.x + this.randSign() * Math.random() * this.inner_range,
            y: core.position.y + this.randSign() * Math.random() * this.inner_range
          },
          this.inner_radius,
          'rgba(240, 240, 240, 0.4)'
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
            x: particle.position.x + this.randSign() * Math.random() * particle.radius,
            y: particle.position.y + this.randSign() * Math.random() * particle.radius
          },
          this.outer_radius(),
          'rgba(255, 255, 255, 0.3)'
        );

        outer_particles.push(cloudParticle);
      }
    }

    this.particles = [...this.particles, ...outer_particles];
  }
}

export default CloudEntity
