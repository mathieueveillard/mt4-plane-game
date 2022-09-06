import {CommandsGameInterface} from "../../../interfaces/commands.game.interface";

class CommandsGame {

  private KEYBOARD_CODE = {
    LEFT:  37,
    RIGHT: 39,
    UP: 38,
    A: 65,
    D: 68,
    W: 87,
    SPACE: 32
  };

  private movingKeys: CommandsGameInterface = {
    left  : false,
    right : false,
    up    : false,
    down  : false,
    space : false,
  }

  constructor() {
    window.addEventListener('keyup',   this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
  }

  handleKeys(state: boolean, {keyCode}: KeyboardEvent){
    if (keyCode === this.KEYBOARD_CODE.SPACE) {
      this.movingKeys.space = state
    }

    if (keyCode === this.KEYBOARD_CODE.LEFT || keyCode === this.KEYBOARD_CODE.A) {
      this.movingKeys.left = state
    }

    if (keyCode === this.KEYBOARD_CODE.RIGHT || keyCode === this.KEYBOARD_CODE.D) {
      this.movingKeys.right = state
    }

    if (keyCode === this.KEYBOARD_CODE.UP || keyCode === this.KEYBOARD_CODE.W) {
      this.movingKeys.up = state
    }
  }

  getPlaneInstructions(): CommandsGameInterface {
    return this.movingKeys
  }
}

export default CommandsGame
