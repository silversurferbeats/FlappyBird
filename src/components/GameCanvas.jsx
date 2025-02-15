import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const GameCanvas = () => {
    const canvasRef = useRef(null);
    const [circle, setCircle] = useState({ x: 100, y: 200, radius: 20, velocity: 0 });
    const gravity = 0.5; // Gravedad para hacer que el círculo caiga
    const jumpStrength = -8; // Fuerza del salto
    const [obstacles, setObstacles] = useState([{ x: 300, y: 200, width: 50, height: 50, speed: 2 }]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Aplicar gravedad
            setCircle(prev => ({
                ...prev,
                y: Math.min(prev.y + prev.velocity, canvas.height - prev.radius), // No pasar el suelo
                velocity: prev.velocity + gravity
            }));

            // Dibujar obstáculos
            setObstacles(prevObstacles =>
                prevObstacles.map(obstacle => {
                    let newX = obstacle.x - obstacle.speed;
                    if (newX + obstacle.width < 0) newX = canvas.width; // Reiniciar obstáculo

                    return { ...obstacle, x: newX };
                })
            );

            obstacles.forEach(obstacle => {
                ctx.fillStyle = "red";
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

                if (checkCollision(circle, obstacle)) {
                    console.log("Colisión detectada!");
                }
            });

            requestAnimationFrame(update);
        };

        update();
    }, [circle, obstacles]);

    // Detectar colisiones entre el círculo y los obstáculos
    const checkCollision = (circle, obstacle) => {
        const closestX = Math.max(obstacle.x, Math.min(circle.x, obstacle.x + obstacle.width));
        const closestY = Math.max(obstacle.y, Math.min(circle.y, obstacle.y + obstacle.height));

        const dx = circle.x - closestX;
        const dy = circle.y - closestY;

        return dx * dx + dy * dy < circle.radius * circle.radius;
    };

    // Función para hacer saltar al círculo
    const handleJump = () => {
        setCircle(prev => ({
            ...prev,
            velocity: jumpStrength
        }));
    };

    return (
        <div
            onClick={handleJump}
            onTouchStart={handleJump}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#ddd" }}
        >
            <canvas ref={canvasRef} width={600} height={400} style={{ border: "1px solid black", position: "absolute" }} />
            
            {/* Círculo animado con Framer Motion */}
            <motion.div
                animate={{ y: circle.y }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                style={{
                    position: "absolute",
                    width: circle.radius * 2,
                    height: circle.radius * 2,
                    borderRadius: "50%",
                    background: "blue",
                }}
            />
        </div>
    );
};

export default GameCanvas;
