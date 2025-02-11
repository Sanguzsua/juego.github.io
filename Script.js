const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let score = 0;
let snake;
let food;

window.onload = () => {
  snake = new Snake();
  food = new Food();
  window.setInterval(gameLoop, 100);
  document.addEventListener('keydown', changeDirection);
};

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  snake.move();
  snake.draw();
  food.draw();
  
  if (snake.eat(food)) {
    score++;
    food = new Food();
    document.getElementById('score').textContent = `Puntuación: ${score}`;
  }
  
  if (snake.checkCollision()) {
    alert('Game Over');
    score = 0;
    snake = new Snake();
    document.getElementById('score').textContent = `Puntuación: ${score}`;
  }
}

function Snake() {
  this.snakeArray = [{x: 5, y: 5}];
  this.direction = 'RIGHT';
  this.nextDirection = 'RIGHT'; // Para evitar movimientos simultáneos

  this.draw = function() {
    this.snakeArray.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'green' : 'white';
      ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
    });
  };

  this.move = function() {
    this.direction = this.nextDirection; // Aplicar la nueva dirección en el próximo ciclo
    const head = { ...this.snakeArray[0] };

    if (this.direction === 'LEFT') head.x -= 1;
    if (this.direction === 'RIGHT') head.x += 1;
    if (this.direction === 'UP') head.y -= 1;
    if (this.direction === 'DOWN') head.y += 1;

    this.snakeArray.unshift(head);

    // Solo eliminar la cola si no ha comido
    if (!this.eat(food)) {
      this.snakeArray.pop();
    }
  };

  this.changeDirection = function(newDirection) {
    if (
      (this.direction === 'LEFT' && newDirection !== 'RIGHT') ||
      (this.direction === 'RIGHT' && newDirection !== 'LEFT') ||
      (this.direction === 'UP' && newDirection !== 'DOWN') ||
      (this.direction === 'DOWN' && newDirection !== 'UP')
    ) {
      this.nextDirection = newDirection;
    }
  };

  this.eat = function(food) {
    const head = this.snakeArray[0];
    if (head.x === food.x && head.y === food.y) {
      return true; // No eliminamos la cola en `move()`
    }
    return false;
  };

  this.checkCollision = function() {
    const head = this.snakeArray[0];

    // Chocar con los bordes
    if (head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows) return true;

    // Chocar con su propio cuerpo
    for (let i = 1; i < this.snakeArray.length; i++) {
      if (this.snakeArray[i].x === head.x && this.snakeArray[i].y === head.y) return true;
    }

    return false;
  };
}

function Food() {
  this.x = Math.floor(Math.random() * columns);
  this.y = Math.floor(Math.random() * rows);

  this.draw = function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x * scale, this.y * scale, scale, scale);
  };
}

function changeDirection(event) {
  if (event.keyCode === 37) snake.changeDirection('LEFT');
  if (event.keyCode === 38) snake.changeDirection('UP');
  if (event.keyCode === 39) snake.changeDirection('RIGHT');
  if (event.keyCode === 40) snake.changeDirection('DOWN');
}

