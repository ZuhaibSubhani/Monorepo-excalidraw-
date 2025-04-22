"use client";
import { useRef, useEffect } from "react";

function Animation() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const raf = useRef<number|null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const ball = {
            x: 100,
            y: 100,
            vx: 5,
            vy: 2,
            radius: 25,
            color: "blue",
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fillStyle = this.color;
                ctx.fill();
            },
        };

        function draw() {
            if (!ctx || !canvas) return; 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ball.draw();
            ball.x += ball.vx;
            ball.y += ball.vy;

            if (ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius) {
                ball.vy = -ball.vy;
            }
            if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius) {
                ball.vx = -ball.vx;
            }

            raf.current = window.requestAnimationFrame(draw);
        }

        // Start animation immediately
        raf.current = window.requestAnimationFrame(draw);

        // Cleanup on unmount
        return () => window.cancelAnimationFrame(raf.current as number);
    }, []);

    return (
        <div>
            <canvas ref={canvasRef} width={500} height={300} style={{ backgroundColor: "transparent" }}></canvas>
        </div>
    );
}

export default Animation;
