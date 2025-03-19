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

// Draw player function
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Update game frame
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    requestAnimationFrame(update);
}

// Player movement
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') player.x += player.speed;
    if (event.key === 'ArrowLeft') player.x -= player.speed;
    if (event.key === 'ArrowUp') player.y -= player.speed;
    if (event.key === 'ArrowDown') player.y += player.speed;
});

// Start game loop
update();
