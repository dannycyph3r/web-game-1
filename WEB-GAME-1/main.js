// 🎯 Screen Selection
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let powerUps = [];
let obstacles = [];

let player;
let keys;
let score = 0;
let level = 1;
let invincible = false;
let boostActive = false;

// 🎯 Start Game on Button Click
startBtn.addEventListener('click', () => {
    introScreen.classList.add('hidden');   // Hide intro
    gameScreen.classList.remove('hidden'); // Show game
    startGame();                           // Start the game
});

// 🎯 Initialize Game Properties
function initGame() {
    player = {
        x: 50,
        y: 300,
        width: 30,
        height: 30,
        speed: 5,
        color: 'blue'
    };

    keys = {
        ArrowRight: false,
        ArrowLeft: false,
        ArrowUp: false,
        ArrowDown: false
    };

    score = 0;
    level = 1;
    obstacles = [];
    powerUps = [];
    particles = [];
}

// 🎯 Particle Effects
function createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x,
            y: y,
            size: Math.random() * 5 + 2,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 4 - 2,
            color: color,
            lifetime: 30
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.lifetime--;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.lifetime <= 0) {
            particles.splice(i, 1);
        }
    }
}

// 🎯 Event Listeners for Player Movement
document.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) keys[event.key] = false;
});

// 🎯 Draw Player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// 🎯 Move Player
function movePlayer() {
    if (keys.ArrowRight && player.x + player.width < canvas.width) player.x += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y + player.height < canvas.height) player.y += player.speed;
}

// 🎯 Create Obstacles
function createObstacle() {
    const size = 40;  
    const obstacle = {
        x: canvas.width,
        y: Math.random() * (canvas.height - size),
        width: size,
        height: size,
        speed: 3 + level * 0.5  // Increase speed with level
    };
    obstacles.push(obstacle);
}

// 🎯 Move & Draw Obstacles
function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacles[i].speed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);  // Remove off-screen obstacles
        }
    }
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    for (let obs of obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

// 🎯 Collision Detection
function checkCollision() {
    if (invincible) return;  // No collision during invincibility

    for (let obs of obstacles) {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            createParticles(player.x, player.y, 'red');
            
            // Delay game over message slightly for smoother effect
            setTimeout(() => {
                alert(`Game Over! Score: ${score}`);
                document.location.reload();
            }, 300);

            return;
        }
    }
}

// 🎯 Power-Ups Logic
function createPowerUp() {
    const powerUp = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        speed: 2,
        type: Math.random() > 0.5 ? 'boost' : 'invincible'  // Random type
    };
    powerUps.push(powerUp);
}

function movePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].x -= powerUps[i].speed;

        if (powerUps[i].x + powerUps[i].width < 0) {
            powerUps.splice(i, 1);
        }
    }
}

function drawPowerUps() {
    for (let pu of powerUps) {
        ctx.fillStyle = pu.type === 'boost' ? 'green' : 'yellow';
        ctx.fillRect(pu.x, pu.y, pu.width, pu.height);
    }
}

// 🎯 Power-Up Collision
function checkPowerUpCollision() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        let pu = powerUps[i];

        if (
            player.x < pu.x + pu.width &&
            player.x + player.width > pu.x &&
            player.y < pu.y + pu.height &&
            player.y + player.height > pu.y
        ) {
            createParticles(player.x, player.y, pu.type === 'boost' ? 'green' : 'yellow');

            if (pu.type === 'boost') {
                player.speed = 10;
                boostActive = true;
                setTimeout(() => {
                    player.speed = 5;
                    boostActive = false;
                }, 5000);
            } else if (pu.type === 'invincible') {
                invincible = true;
                setTimeout(() => {
                    invincible = false;
                }, 5000);
            }
            powerUps.splice(i, 1);
        }
    }
}

// 🎯 Level Progression
function levelUp() {
    level++;
    console.log(`Level Up! Level: ${level}`);
}

// 🎯 Update Score
function updateScore() {
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
}

// 🎯 Main Game Loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveObstacles();
    movePowerUps();

    drawPlayer();
    drawObstacles();
    drawPowerUps();

    checkCollision();
    checkPowerUpCollision();
    updateParticles();

    requestAnimationFrame(update);
}

// 🎯 Start Game Function
function startGame() {
    initGame();

    // Reset intervals before starting the game
    clearInterval(createObstacleInterval);
    clearInterval(scoreInterval);
    clearInterval(powerUpInterval);
    clearInterval(levelInterval);

    // Set intervals
    createObstacleInterval = setInterval(createObstacle, 2000);
    scoreInterval = setInterval(updateScore, 1000);
    powerUpInterval = setInterval(createPowerUp, 5000);
    levelInterval = setInterval(levelUp, 15000);

    update();
}

// 🎯 Game intervals
let createObstacleInterval;
let scoreInterval;
let powerUpInterval;
let levelInterval;
