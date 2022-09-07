import CanvasGame from "./settings/canvas.game";
import UserPlayer from "./players/user.player";
import PlaneEntity from "./entities/plane.entity";
import CommandsGame from "./settings/commands.game";
import BulletEntity from "./entities/bullet.entity";
import ParticleEntity from "./entities/particle.entity";
import CloudEntity from "./entities/cloud.entity";
import CalculatorsApp from "../apps/calculators.app";

class MainGame extends CanvasGame {

  public bullets: BulletEntity[] = []
  public clouds: CloudEntity[] = []
  public particles: ParticleEntity[] = []
  private users: UserPlayer[] = []
  private planes: PlaneEntity[] = []
  private commands = new CommandsGame()

  startGame() {
    const plane = new PlaneEntity({game: this, position: { x: 500, y: 1000}})
    this.planes.push(plane)

    // x: randomNumBetweenExcluding(0, this.c.screen.width, ship.position.x-60, ship.position.x+60),
    //   y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)

    const {width, height} = this.getCanvasSize()



    this.getCanvasSize()


    const cloud = new CloudEntity({game: this, position: { x: CalculatorsApp.randomNumberBetween(0, width), y:     CalculatorsApp.randomNumberBetween(0, height)}})
    this.clouds.push(cloud)

    console.log(this.clouds)

    this.planes.push(new PlaneEntity({game: this, position: { x: 500, y: 100}}))
    this.planes.push(new PlaneEntity({game: this, position: { x: 500, y: 500}}))
    this.planes.push(new PlaneEntity({game: this, position: { x: 400, y: 100}}))
    this.planes.push(new PlaneEntity({game: this, position: { x: 200, y: 500}}))
    this.planes.push(new PlaneEntity({game: this, position: { x: 600, y: 150}}))
    this.planes.push(new PlaneEntity({game: this, position: { x: 600, y: 100}}))
  }

  update() {
    this.saveContext();
    this.refreshCanvas()

    const plane = this.planes[0]

    const planeInstructions = this.commands.getPlaneInstructions()
    plane.move(planeInstructions)

    // Temporary -> moving plane
    for (const plane of this.planes.slice(1, this.planes.length)) {
      plane.move({
        left: false,
        right: false,
        up: false,
        down: false,
        space: false,
      })
    }

    this.updateObjects(this.bullets)
    this.updateObjects(this.planes)
    this.updateObjects(this.particles)
    this.updateObjects(this.clouds)

    this.checkCollisionsWithPlanesAndCloud(this.planes, this.clouds)
    this.checkCollisionsPlanesAndBullets(this.planes, this.bullets)
    console.log(this.clouds)
    this.restoreContext()
  }

  checkCollisionsPlanesAndBullets(planes: PlaneEntity[], bullets: BulletEntity[]) {
    for (const bullet of bullets) {

      for (const plane of planes) {

        if (this.checkCollision(plane, bullet)) {
          bullet.destroy()

          if (plane.lives === 1) {
            plane.destroy()

          } else {
            plane.impact()
          }

        }

      }
    }
  }


  checkCollisionsWithPlanesAndCloud(planes: PlaneEntity[], clouds: CloudEntity[]) {
    for (const cloud of clouds) {

      for (const plane of planes) {

        if (this.checkCollision(plane, cloud)) {
          // cloud.destroy()

          if (plane.lives === 1) {
            // plane.destroy()

          } else {
            plane.impact()
          }

        }

      }
    }
  }

  checkCollision(plane: PlaneEntity, bullet: BulletEntity | CloudEntity) {
    const vx = plane.position.x - bullet.position.x;
    const vy = plane.position.y - bullet.position.y;

    const length = Math.sqrt(vx * vx + vy * vy);

    return length < plane.radius + bullet.radius && (bullet.plane !== plane)
  }

  updateObjects(items: PlaneEntity[] | BulletEntity[] | CloudEntity[] | ParticleEntity[]) {
    for (let [idx, item] of items.entries()) {

      if (item.delete) {
        items.splice(idx, 1);

      } else {
        items[idx].render();
      }

    }
  }
}

export default MainGame

