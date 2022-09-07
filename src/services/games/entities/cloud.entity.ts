import PlaneEntity from "./plane.entity";
import MainGame from "../main.game";
import PositionGame from "../settings/position.game";
import VelocityGame from "../settings/velocity.game";
import CalculatorsApp from "../../apps/calculators.app";

class CloudEntity {
  public position: PositionGame
  public radius: number = 20
  public readonly plane: PlaneEntity

  private velocity: VelocityGame
  private delete: boolean = false

  private readonly rotation: number = 0
  // private readonly vertices: { x: number; y: number; }[] = this.getVertices(35, 100)


  private particles: any = []

  private readonly game: MainGame
  cores: any = [];

  inner_density = 10;
  outer_density = 25


  inner_range = 40;
  inner_radius = 15;

  num_cores = 5;

  // width = CalculatorsApp.randomNumberBetween(150, 500);
  // height = CalculatorsApp.randomNumberBetween(150, 500);

  width = 250;
  height = 150;

  core_radius = 15;

  outer_radius = function() {return Math.random()*3+5};


  constructor({game, position}: { game: MainGame, position: PositionGame }) {
    this.position = new PositionGame(position)

    this.velocity = new VelocityGame({
      x: CalculatorsApp.randomNumberBetween(-1.5, 1.5),
      y: CalculatorsApp.randomNumberBetween(-1.5, 1.5)
    })

    for(var i=0;i<this.num_cores;i++) {
      var cp = this.setCloudParticle(
        {x: this.width/4+Math.random()*(this.width/2), y: this.height/4+Math.random()*(this.height/2)},
        this.core_radius,
        'rgba(210, 210, 210, 0.5)'
      );

      this.particles.push(cp);
      this.cores.push(cp);
    }

    for(var j=0;j<this.cores.length;j++) {
      var core = this.cores[j];
      for(var i=0;i<this.inner_density;i++) {
        var cp = this.setCloudParticle(
          {x: core.position.x + this.randSign()*Math.random()*this.inner_range,
          y: core.position.y + this.randSign()*Math.random()*this.inner_range },
          this.inner_radius,
          'rgba(240, 240, 240, 0.4)'
        );
        this.particles.push(cp);
      }
    }

    var outer_particles = [];
    for(var j=0;j<this.particles.length;j++) {
      var base = this.particles[j];
      for(var i=0;i<this.outer_density;i++) {
        var cp = this.setCloudParticle(
          {x: base.position.x + this.randSign()*Math.random()*base.radius,
          y: base.position.y + this.randSign()*Math.random()*base.radius},
          this.outer_radius(),
          'rgba(255, 255, 255, 0.3)'
        );
        outer_particles.push(cp);
      }
    }

    console.log(outer_particles)
    this.particles = [...this.particles, ...outer_particles];
    console.log(this.particles)


    this.game = game
  }


  randSign() {
    return Math.floor(Math.random()*2)*-2+1;
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
    // this.position.x += this.velocity.x;
    // this.position.y += this.velocity.y;

    if (this.game.isOutOfArea(this.position)) {
      this.destroy();
    }

    const context: CanvasRenderingContext2D = this.game.getContext()

    context.save();
    // context.translate(this.position.x, this.position.y);
    // context.rotate(this.rotation * Math.PI / 180);
    // context.strokeStyle = '#FFF';
    // context.fillStyle = '#FFF';
    // context.lineWidth = 2;
    // context.beginPath();
    // context.moveTo(0, -this.radius);
    console.log(this.particles.length)

    // context.beginPath();
    var offsetx = 500 || 0;
    var offsety = 500 || 0;
    for(var i=0;i<this.particles.length;i++) {
      var part = this.particles[i];

      context.beginPath();


      context.arc(offsetx + part.position.x, offsety + part.position.y, part.radius, 0, 2 * Math.PI, false);


      context.fillStyle = part.color;

      context.closePath();
      context.fill();
      context.closePath();

    }

    // context.closePath();

    // context.fill();

    // context.stroke();
    context.restore();
  }
}

export default CloudEntity
