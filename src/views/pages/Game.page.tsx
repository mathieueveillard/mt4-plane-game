import MapGame from "../molecules/games/MapGame";
import {useEffect} from "react";

const GamePage = () => {

  // Is removed because of performance issue
  // useEffect(() => {
  //   javascript:(function(){var script=document.createElement('script');script.onload=function(){ // @ts-ignore
  //     var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()
  // })

  return (
    <section className="game" style={{overflow: "hidden"}}>
      {/* <span className="game__controls" >*/}
      {/*    Use [A][S][W][D] or [←][↑][↓][→] to MOVE<br/>*/}
      {/*    Use [SPACE] to SHOOT*/}
      {/*</span>*/}


      {/*<canvas ref="canvas"*/}
      {/*        width={this.state.screen.width * this.state.screen.ratio}*/}
      {/*        height={this.state.screen.height * this.state.screen.ratio}*/}
      {/*/>*/}
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <MapGame></MapGame>
    </section>
  )
}

export default GamePage
