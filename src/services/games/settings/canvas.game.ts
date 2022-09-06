import WindowApp from "../../apps/window.app";
import PositionGame from "./position.game";

class CanvasGame {

  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('[CanvasGame] canvas not defined');
    }

    this.canvas = canvas

    this.context = canvas.getContext('2d') as CanvasRenderingContext2D

    this.updateContext()

    const {width, height} = WindowApp.getDimensions()

    this.setCanvasDimensions(width, height)
  }

  updateContext() {
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
  }

  refreshCanvas() {
    this.context.save();

    this.context.fillStyle = '#000';
    this.context.globalAlpha = 0.4;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.globalAlpha = 1;

    this.context.restore();
  }

  getContext(): CanvasRenderingContext2D {
    return this.context
  }

  getCanvasSize() {
    return {width: this.canvas.width, height: this.canvas.height}
  }

  isOutOfArea({x, y}: PositionGame): boolean {
    const {width, height} = this.getCanvasSize()

    return x < 0 || y < 0 || x > width || y > height
  }


  saveContext() {
    this.context.save();
  }

  restoreContext() {
    this.context.restore();
  }

  setCanvasDimensions(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }

  setBackgroundDimension(width: number, height: number) {
    this.context.fillRect(0, 0, width, height)
  }

  setBackgroundColor(color: string) {
    this.context.fillStyle = color
  }

}

export default CanvasGame
