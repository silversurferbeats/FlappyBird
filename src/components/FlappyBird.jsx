import React, { useState, useEffect, useRef } from "react";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const BIRD_SIZE = 20;
const GRAVITY = 0.6;
const JUMP = -7;
const PIPE_WIDTH = 50;
const PIPE_GAP = 120;
const PIPE_SPEED = 2;

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(CANVAS_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: CANVAS_WIDTH, height: 200 }]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const gameLoop = setInterval(() => {
      if (gameOver) return;
      
      setBirdY((prev) => prev + velocity);
      setVelocity((prev) => prev + GRAVITY);
      
      setPipes((prev) => {
        const newPipes = prev.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
        if (newPipes[0].x + PIPE_WIDTH < 0) {
          newPipes.shift();
          newPipes.push({ x: CANVAS_WIDTH, height: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 50) + 50 });
          setScore((prev) => prev + 1);
        }
        return newPipes;
      });

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "skyblue";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = "yellow";
      ctx.fillRect(50, birdY, BIRD_SIZE, BIRD_SIZE);
      
      ctx.fillStyle = "green";
      pipes.forEach((pipe) => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT);
        
        if (
          (50 + BIRD_SIZE > pipe.x && 50 < pipe.x + PIPE_WIDTH &&
            (birdY < pipe.height || birdY + BIRD_SIZE > pipe.height + PIPE_GAP)) ||
          birdY + BIRD_SIZE >= CANVAS_HEIGHT
        ) {
          setGameOver(true);
        }
      });

      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, 10, 20);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [birdY, velocity, pipes, gameOver]);

  const handleJump = () => {
    if (!gameOver) setVelocity(JUMP);
    else {
      setBirdY(CANVAS_HEIGHT / 2);
      setVelocity(0);
      setPipes([{ x: CANVAS_WIDTH, height: 200 }]);
      setScore(0);
      setGameOver(false);
    }
  };

  return (
    <div onClick={handleJump} style={{ textAlign: "center", marginTop: 20 }}>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: "1px solid black" }} />
      {gameOver && <h2>Game Over! Click to restart</h2>}
    </div>
  );
};

export default FlappyBird;
