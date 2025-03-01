import React, { useState, useEffect, useRef } from "react";
import ImgElement from "../assets/gotaElement.mp4";
import BgVideo from "../assets/OceanoVideo.mp4";
import bgMp3 from '../assets/CastList.mp3';
import jumpMp3 from '../assets/jump.wav';
import loseMp3 from '../assets/lose.wav';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;
const BIRD_SIZE = 40;
const GRAVITY = 0.6;
const JUMP = -7;
const PIPE_WIDTH = 80;
const PIPE_GAP = 150;
// const PIPE_SPEED = 2;

const FlappyBird = () => {
  const [birdY, setBirdY] = useState(CANVAS_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ x: CANVAS_WIDTH, height: 200 }]);
  const [score, setScore] = useState(0);
  const [pipeSpeed, setPipeSpeed] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const bgRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [bgVideo, setBgVideo] = useState(false);
  const [musicBg, setMusicBg] = useState(false);
  // Sound:
  const jumpAudio = new Audio(jumpMp3);
  const loseAudio = new Audio(loseMp3);
  const bgAudioRef = useRef(new Audio(bgMp3));
  
  useEffect(() => {
    const video = document.createElement("video");
    video.src = ImgElement;
    video.loop = true;
    video.muted = true;
    video.play();

    video.oncanplay = () => {
      videoRef.current = video;
      setVideoLoaded(true);
    };

    video.onerror = () => console.error("Failed to load bird video");
  }, []);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = BgVideo;
    video.loop = true;
    video.muted = true;
    video.play();

    video.oncanplay = () => {
      bgRef.current = video;
      setBgVideo(true);
    };

    video.onerror = () => console.error("Failed to load background video");
  }, []);

  useEffect(() => {
    console.log('El score ha cambiado a:', score);
    setPipeSpeed(pipeSpeed + 0.5);
  }, [score]);

  useEffect(() => {
    const bgAudio = bgAudioRef.current;
    bgAudio.loop = true; // Para que la música de fondo no se detenga
  
    if (musicBg && !gameOver) {
      bgAudio.play();
    } else {
      bgAudio.pause();
      bgAudio.currentTime = 0; // Reinicia la música
    }
  }, [musicBg, gameOver]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    const gameLoop = setInterval(() => {
      if (gameOver) return;
      setMusicBg(true);

      setBirdY((prev) => prev + velocity);
      setVelocity((prev) => prev + GRAVITY);

      setPipes((prev) => {
        const newPipes = prev.map((pipe) => ({
          ...pipe,
          x: pipe.x - pipeSpeed,
        }));
        if (newPipes[0].x + PIPE_WIDTH < 0) {
          newPipes.shift();
          newPipes.push({
            x: CANVAS_WIDTH,
            height: Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 50) + 50,
          });
          setScore((prev) => prev + 1);
        }
        return newPipes;
      });

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (bgVideo && bgRef.current) {
        ctx.drawImage(bgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (videoLoaded && videoRef.current) {
        ctx.save();
        ctx.beginPath(); //-> Crea un nuevo camino de dibujo.
        ctx.arc(
          50 + BIRD_SIZE / 2,
          birdY + BIRD_SIZE / 2,
          BIRD_SIZE / 2,
          0,
          Math.PI * 2
        ); //-> Dibuja un círculo en la posición de la gota.
        ctx.clip(); //->  Aplica el recorte, limitando el canvas a la forma del círculo.
        ctx.drawImage(videoRef.current, 50, birdY, BIRD_SIZE, BIRD_SIZE); //-> Dibuja el video dentro del área recortada.
        ctx.restore(); //-> Restaura el estado del canvas para que el recorte no afecte otros elementos.
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(50, birdY, BIRD_SIZE, BIRD_SIZE);
      }

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
          setMusicBg(false);
          bgAudioRef.current.pause();
          loseAudio.play();
          setPipeSpeed(2);
        } 
      });

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Puntaje: ${score}`, 10, 20);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [birdY, velocity, pipes, gameOver, videoLoaded]);

  const handleJump = () => {
    if (!gameOver) {
      jumpAudio.play();
      setVelocity(JUMP);
    } else {
      setBirdY(CANVAS_HEIGHT / 2);
      setVelocity(0);
      setPipes([{ x: CANVAS_WIDTH, height: 200 }]);
      setScore(0);
      setGameOver(false);
    }
  };

  return (
    <div onClick={handleJump} style={{ textAlign: "center", marginTop: 60 }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid black" }}
      />
      {gameOver && <h2>Su puntaje fue de: {score}. Click para comenzar </h2>}
    </div>
  );
};

export default FlappyBird;
