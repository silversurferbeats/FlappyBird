import "./App.css";
import { useEffect, useState } from "react";
import Element from "./components/Element";
import video from "./assets/BgVideo.mp4";
import Obstacle from "./components/Obstacle";
import FlappyBird from "./components/FlappyBird";

function App() {
  const [elementPosition, setElementPosition] = useState({ x: 50, y: 200 });
  const [obstaclePosition, setObstaclePosition] = useState({ x: 500, y: 200 });
  // const [gameOver, setGameOver] = useState(false);

  // useEffect(() => {
  //   if (!gameOver) {
  //     const interval = setInterval(() => {
  //       setObstaclePosition((prev) => {
  //         if (prev.x <= -50) return { x: 500, y: prev.y }; // Resetea cuando sale de pantalla
  //         return { x: prev.x - 10, y: prev.y };
  //       });
  //     }, 100);
  //     return () => clearInterval(interval);
  //   }
  // }, [gameOver]);

  // Detectar colisión
  useEffect(() => {
    const detectCollision = () => {
      const elementWidth = 50;
      const elementHeight = 50;
      const obstacleWidth = 50;
      const obstacleHeight = 50;

      if (
        elementPosition.x < obstaclePosition.x + obstacleWidth &&
        elementPosition.x + elementWidth > obstaclePosition.x &&
        elementPosition.y < obstaclePosition.y + obstacleHeight &&
        elementPosition.y + elementHeight > obstaclePosition.y
      ) {
        setGameOver(true);
        alert("Game Over!");
      }
    };

    const collisionInterval = setInterval(detectCollision, 50);
    return () => clearInterval(collisionInterval);
  }, [elementPosition, obstaclePosition]);

  return (
    // <div className="BoxContainer">
    //   <div className="vid">
    //     <video
    //       src={video}
    //       autoPlay
    //       loop
    //       muted
    //       playsInline={true}
    //       type="video/mp4"
    //     ></video>
    //   </div>
    //   <Element />
    //   <Obstacle />
    // </div>
    <FlappyBird />
  );
}

export default App;
