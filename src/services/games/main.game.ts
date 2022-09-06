import CanvasGame from "./settings/canvas.game";
import UserPlayer from "./players/user.player";
import PlaneEntity from "./entities/plane.entity";
import CommandsGame from "./settings/commands.game";
import BulletEntity from "./entities/bullet.entity";
import ParticleEntity from "./entities/particle.entity";

class MainGame extends CanvasGame {

  public bullets: BulletEntity[] = []
  public particles: ParticleEntity[] = []
  private users: UserPlayer[] = []
  private planes: PlaneEntity[] = []
  private commands = new CommandsGame()

  startGame() {
    const plane = new PlaneEntity({game: this, position: { x: 500, y: 1000}})
    this.planes.push(plane)


    this.planes.push(new PlaneEntity({game: this, position: { x: 500, y: 100}}))
    this.planes.push(new PlaneEntity({game: this, position: { x: 500, y: 200}}))
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

    this.checkCollisionsWith(this.planes, this.bullets)

    this.restoreContext()
  }

  checkCollisionsWith(planes: PlaneEntity[], bullets: BulletEntity[]) {
    for (const bullet of bullets) {
    // switch (CalculatorsApp.randomNumberBetween(0, 5, {round: true})) {

      for (const plane of planes) {

        if (this.checkCollision(plane, bullet)) {
          bullet.destroy()

          if (plane.lives === 1) {
            plane.destroy()

          } else {
            plane.lives -= 1
          }

        }

      }
    }
  }

  checkCollision(plane: PlaneEntity, bullet: BulletEntity) {
    const vx = plane.position.x - bullet.position.x;
    const vy = plane.position.y - bullet.position.y;

    const length = Math.sqrt(vx * vx + vy * vy);

    return length < plane.radius + bullet.radius && (bullet.plane !== plane)
  }

  updateObjects(items: any[]) {
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

