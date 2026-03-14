const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

const GRID = 20;
const CELL = canvas.width / GRID;
const TICK_MS = 150;

let snake, dir, nextDir, food, score, interval;

function init() {
  const mid = Math.floor(GRID / 2);
  snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = "Score: 0";
  overlay.classList.add("hidden");
  spawnFood();
  clearInterval(interval);
  interval = setInterval(tick, TICK_MS);
}

function spawnFood() {
  const occupied = new Set(snake.map((s) => s.x + "," + s.y));
  const empty = [];
  for (let x = 0; x < GRID; x++) {
    for (let y = 0; y < GRID; y++) {
      if (!occupied.has(x + "," + y)) empty.push({ x, y });
    }
  }
  food = empty[Math.floor(Math.random() * empty.length)];
}

function tick() {
  dir = nextDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
    return gameOver();
  }

  // Self collision
  for (const seg of snake) {
    if (seg.x === head.x && seg.y === head.y) return gameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = "Score: " + score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  ctx.strokeStyle = "#1a1a3e";
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(canvas.width, i * CELL);
    ctx.stroke();
  }

  // Draw food
  ctx.fillStyle = "#e94560";
  ctx.fillRect(food.x * CELL + 1, food.y * CELL + 1, CELL - 2, CELL - 2);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#4ecca3" : "#36b390";
    ctx.fillRect(
      snake[i].x * CELL + 1,
      snake[i].y * CELL + 1,
      CELL - 2,
      CELL - 2
    );
  }
}

function gameOver() {
  clearInterval(interval);
  finalScoreEl.textContent = "Score: " + score;
  overlay.classList.remove("hidden");
}

// Controls
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if ((key === "ArrowUp" || key === "w") && dir.y !== 1) {
    nextDir = { x: 0, y: -1 };
  } else if ((key === "ArrowDown" || key === "s") && dir.y !== -1) {
    nextDir = { x: 0, y: 1 };
  } else if ((key === "ArrowLeft" || key === "a") && dir.x !== 1) {
    nextDir = { x: -1, y: 0 };
  } else if ((key === "ArrowRight" || key === "d") && dir.x !== -1) {
    nextDir = { x: 1, y: 0 };
  }
});

restartBtn.addEventListener("click", init);

// Start
init();
draw();
