import CanvasGame from "./settings/canvas.game";
import PlaneEntity from "./entities/plane.entity";
import CommandsGame from "./settings/commands.game";
import BulletEntity from "./entities/bullet.entity";
import { Socket } from "socket.io-client";
import ParticleEntity from "./entities/particle.entity";
import { IPosition } from "../../App";

class MainGame extends CanvasGame {

  public bullets: BulletEntity[] = []
  public particles: ParticleEntity[] = []
  private planes: PlaneEntity[] = []
  private commands = new CommandsGame()
  private lastShot: number = 0
  private socket: Socket

  startGame(socket: Socket, players: string[]) {
    this.socket = socket

    const currentPlayer = players.find((player) => player === socket.id)
    const enemyPlayers = players.filter((player) => player !== socket.id)

    if (currentPlayer) {
      const plane = new PlaneEntity({
        game: this,
        position: { x: 200, y: 300},
        socketId: currentPlayer
      })

      this.planes.push(plane)

      enemyPlayers.forEach((player, index) => {
        const plane = new PlaneEntity({
          game: this,
          position: { x: 200 * index + 1, y: 300 * index + 1},
          socketId: player
        })

        this.planes.push(plane)
      })
    }
  }

  update() {
    this.saveContext();
    this.refreshCanvas()

    const currentPlane = this.planes[0]

    const planeInstructions = this.commands.getPlaneInstructions()
    currentPlane.move(planeInstructions)

    this.sendPositionToEnemies(currentPlane.position)

    this.updateObjects(this.bullets)
    this.updateObjects(this.planes)
    this.updateObjects(this.particles)

    this.checkCollisionsWith(this.planes, this.bullets)

    this.restoreContext()
  }

  sendPositionToEnemies(position: IPosition) {
    const dateNow = Date.now()

    if (dateNow - this.lastShot > 10) {
      this.planes.forEach((plane, index) => {
        if (plane.socketId !== this.socket.id) {
          this.socket.emit("move", plane.socketId, position.x, position.y)
        }
      })
    }
  }

  updateEnemyPosition(position: IPosition) {
    const enemyPlane = this.planes[1]

    if (enemyPlane) {
      enemyPlane.position = position
    }
  }

  checkCollisionsWith(planes: PlaneEntity[], bullets: BulletEntity[]) {
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

