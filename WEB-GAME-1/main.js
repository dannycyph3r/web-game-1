const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 5,
    color: 'blue'
};

// Movement speed
let keys = {
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false
};

// Obstacles array
let obstacles = [];
let score = 0;

// 🎯 Event listeners for smooth movement
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
});

// 🎯 Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 🎯 Player movement logic
function movePlayer() {
    if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y + player.height < canvas.height) player.y += player.speed;
}

// 🎯 Create obstacles
function createObstacle() {
    const size = Math.random() * 40 + 20;  // Random size
    const obstacle = {
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        width: size,
        height: size,
        speed: 2
    };
    obstacles.push(obstacle);
}

// 🎯 Move obstacles
function moveObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= obstacles[i].speed;

        // Remove obstacles that move off-screen
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// 🎯 Draw obstacles
function drawObstacles() {
    ctx.fillStyle = 'red';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

// 🎯 Collision detection
function checkCollision() {
    for (let obs of obstacles) {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            alert(`Game Over! Your score: ${score}`);
            document.location.reload();
        }
    }
}

// 🎯 Update the score
function updateScore() {
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
}

// 🎯 Main update function (combined game loop)
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveObstacles();
    drawPlayer();
    drawObstacles();
    checkCollision();

    requestAnimationFrame(update);
}

// 🎯 Game loop setup
setInterval(createObstacle, 2000);  // Create new obstacles every 2 seconds
setInterval(updateScore, 1000);     // Increase score every second

// Start the game
update();
