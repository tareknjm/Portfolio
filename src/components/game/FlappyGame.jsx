import { useEffect, useRef, useState } from "react";

const GRAVITY = 0.45;
const JUMP = -7.5;
const PIPE_GAP = 150;
const PIPE_WIDTH = 60;
const PIPE_SPEED = 2.8;
const BIRD_SIZE = 22;

function FlappyGame({ onClose }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [status, setStatus] = useState("ready"); // ready | playing | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(function () {
    return Number(localStorage.getItem("flappy_best") || 0);
  });

  function resetState() {
    stateRef.current = {
      birdY: 150,
      velocity: 0,
      pipes: [{ x: 400, gapY: 150 }],
      frame: 0,
      score: 0,
    };
  }

  function flap() {
    if (status === "ready") {
      resetState();
      setStatus("playing");
      setScore(0);
    }
    if (status === "over") {
      resetState();
      setStatus("playing");
      setScore(0);
      return;
    }
    if (stateRef.current) {
      stateRef.current.velocity = JUMP;
    }
  }

  useEffect(function () {
    function handleKey(e) {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
    }
    window.addEventListener("keydown", handleKey);
    return function () {
      window.removeEventListener("keydown", handleKey);
    };
  });

  useEffect(function () {
    if (status !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let animationId;

    function loop() {
      const s = stateRef.current;
      s.frame += 1;
      s.velocity += GRAVITY;
      s.birdY += s.velocity;

      if (s.frame % 90 === 0) {
        s.pipes.push({
          x: width,
          gapY: 60 + Math.random() * (height - PIPE_GAP - 120),
        });
      }

      s.pipes.forEach(function (p) {
        p.x -= PIPE_SPEED;
      });
      s.pipes = s.pipes.filter(function (p) {
        return p.x > -PIPE_WIDTH;
      });

      const birdX = 70;
      let collided = s.birdY < 0 || s.birdY + BIRD_SIZE > height;

      s.pipes.forEach(function (p) {
        const inX = birdX + BIRD_SIZE > p.x && birdX < p.x + PIPE_WIDTH;
        const inGap = s.birdY > p.gapY && s.birdY + BIRD_SIZE < p.gapY + PIPE_GAP;
        if (inX && !inGap) collided = true;
        if (p.x + PIPE_WIDTH === birdX || (p.x + PIPE_WIDTH < birdX && !p.passed)) {
          if (!p.passed && p.x + PIPE_WIDTH < birdX) {
            p.passed = true;
            s.score += 1;
            setScore(s.score);
          }
        }
      });

      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0f0a1e");
      grad.addColorStop(1, "#1a1030");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#22d3ee";
      s.pipes.forEach(function (p) {
        ctx.fillRect(p.x, 0, PIPE_WIDTH, p.gapY);
        ctx.fillRect(p.x, p.gapY + PIPE_GAP, PIPE_WIDTH, height - p.gapY - PIPE_GAP);
      });

      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(birdX + BIRD_SIZE / 2, s.birdY + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      if (collided) {
        setStatus("over");
        setBest(function (prevBest) {
          const newBest = Math.max(prevBest, s.score);
          localStorage.setItem("flappy_best", String(newBest));
          return newBest;
        });
        return;
      }

      animationId = requestAnimationFrame(loop);
    }

    animationId = requestAnimationFrame(loop);
    return function () {
      cancelAnimationFrame(animationId);
    };
  }, [status]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-white">
        <span className="text-sm">
          Score <span className="font-bold text-purple-400">{score}</span>
        </span>
        <span className="text-sm">
          Best <span className="font-bold text-cyan-400">{best}</span>
        </span>
      </div>

      <div
        className="relative rounded-xl overflow-hidden border border-white/10 cursor-pointer select-none"
        onClick={flap}
      >
        <canvas ref={canvasRef} width={340} height={420} />

        {status !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm text-white text-center px-6">
            {status === "ready" && (
              <>
                <p className="text-lg font-bold mb-1">🎮 Pause café</p>
                <p className="text-sm text-white/70">
                  Clique ou appuie sur Espace pour jouer
                </p>
              </>
            )}
            {status === "over" && (
              <>
                <p className="text-lg font-bold mb-1">Game Over 💀</p>
                <p className="text-sm text-white/70">
                  Score : {score} — Clique pour rejouer
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="text-sm text-white/50 hover:text-white transition-colors"
      >
        Retour au portfolio →
      </button>
    </div>
  );
}

export default FlappyGame;