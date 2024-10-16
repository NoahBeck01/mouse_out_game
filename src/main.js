import {
    Level1coords,
    Level2coords,
    Level3coords,
    Level4coords,
    Level1Coins,
    Level2Coins,
    Level3Coins,
    Level4Coins,
} from "./Levelcoords.js";

// TODO:
// FIX This

// GET ELEMENTBYID (Canvas )
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

document.getElementById("Level1").onclick = function () {
    LevelPress("level1");
};

document.getElementById("Level2").onclick = function () {
    LevelPress("level2");
};

document.getElementById("Level3").onclick = function () {
    LevelPress("level3");
};

document.getElementById("Level4").onclick = function () {
    LevelPress("level4");
};

document.getElementById("Clear").onclick = function () {
    cleanup();
};

let schritte = document.getElementById("Steps");

/**
 * Variablen Abschnitt
 */
let steps = 0;
let firework_enable = false;

// Größe des Canvas
const CANVAS_WIDTH = 1400;
const CANVAS_HEIGHT = 1000;

// Größe jedes Feldes
const FIELD_SIZE = 100;

// Anfangsposition des Spielers
let StartCoords = 0;
let playerX = 0;
let playerY = 0;

let count = document.getElementById("coins");
let coin_count = 0;

//Images Paths
let image_path_maus = "assets/maus.png";
let image_path_coin = "assets/coin.png";
let image_path_wall = "assets/tiles.jpg";
let image_path_door = "assets/door.png";
let image_path_chesse = "assets/chesse.png";

//Lists
let NO_ENTRY_ZONES = [];
let Coin_list = [];

const GoalCoordsX = 13;
const GoalCoordsY = 9;
let doorX = 12;
let doorY = 9;
let doorOpen = false;

// Bild direkt laden
const mausImage = new Image();
mausImage.src = image_path_maus;

const chesseImage = new Image();
chesseImage.src = image_path_chesse;

const coinImage = new Image();
coinImage.src = image_path_coin;

const wallImage = new Image();
wallImage.src = image_path_wall;

const doorImage = new Image();
doorImage.src = image_path_door;

function drawGame() {
    drawGrid();
    drawGoalImage();
    drawCoin();
    if (!doorOpen) drawDoor();
    drawPlayerImage();
    drawWall();
}

function drawDoor() {
    let scale = 1; // Anpassen dieser Werte nach Bedarf
    let scaledWidth = Math.floor(FIELD_SIZE * scale);
    let scaledHeight = Math.floor(FIELD_SIZE * scale);

    ctx.drawImage(
        doorImage, // Verwende das geladene Bild
        doorX * FIELD_SIZE,
        doorY * FIELD_SIZE,
        scaledWidth,
        scaledHeight
    );
}

// Funktion zum Zeichnen der Grid-Struktur
function drawGrid() {
    for (let i = 0; i <= CANVAS_WIDTH / FIELD_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * FIELD_SIZE, 0);
        ctx.lineTo(i * FIELD_SIZE, CANVAS_HEIGHT);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * FIELD_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * FIELD_SIZE);
        ctx.stroke();
    }
}

function drawGoalImage() {
    let scale = 1;
    let scaledWidth = Math.floor(FIELD_SIZE * scale);
    let scaledHeight = Math.floor(FIELD_SIZE * scale);

    ctx.drawImage(
        chesseImage, // Verwende das geladene Bild
        GoalCoordsX * FIELD_SIZE,
        GoalCoordsY * FIELD_SIZE,
        scaledWidth,
        scaledHeight
    );
}

// Funktion zum Zeichnen des Spielers (mit Bild)
function drawPlayerImage() {
    let scale = 1; // Anpassen dieser Werte nach Bedarf
    let scaledWidth = Math.floor(FIELD_SIZE * scale);
    let scaledHeight = Math.floor(FIELD_SIZE * scale);

    ctx.drawImage(
        mausImage, // Verwende das geladene Bild
        playerX * FIELD_SIZE,
        playerY * FIELD_SIZE,
        scaledWidth,
        scaledHeight
    );
}

function drawCoin() {
    let scale = 1;
    let scaledWidth = Math.floor(FIELD_SIZE * scale);
    let scaledHeight = Math.floor(FIELD_SIZE * scale);

    Coin_list.forEach((coin) => {
        const x = coin.x;
        const y = coin.y;

        ctx.drawImage(
            coinImage, // Verwende das geladene Bild
            x * FIELD_SIZE,
            y * FIELD_SIZE,
            scaledWidth,
            scaledHeight
        );
    });
}

function drawWall() {
    let scale = 1;
    let scaledWidth = Math.floor(FIELD_SIZE * scale);
    let scaledHeight = Math.floor(FIELD_SIZE * scale);

    NO_ENTRY_ZONES.forEach((zone) => {
        const x = zone.x;
        const y = zone.y;

        ctx.drawImage(
            wallImage,
            x * FIELD_SIZE,
            y * FIELD_SIZE,
            scaledWidth + 1,
            scaledHeight + 1
        );
    });
}

function LevelPress(level) {
    if (level == "level1") {
        cleanup();
        NO_ENTRY_ZONES = JSON.parse(JSON.stringify(Level1coords));
        Coin_list = JSON.parse(JSON.stringify(Level1Coins));
        doorX = 12;
        doorY = 9;
    }

    if (level == "level2") {
        cleanup();
        NO_ENTRY_ZONES = JSON.parse(JSON.stringify(Level2coords));
        Coin_list = JSON.parse(JSON.stringify(Level2Coins));
        doorX = 13;
        doorY = 8;
    }
    if (level == "level3") {
        cleanup();
        NO_ENTRY_ZONES = JSON.parse(JSON.stringify(Level3coords));
        Coin_list = JSON.parse(JSON.stringify(Level3Coins));
        doorX = 13;
        doorY = 8;
    }

    if (level == "level4") {
        cleanup();
        NO_ENTRY_ZONES = JSON.parse(JSON.stringify(Level4coords));
        Coin_list = JSON.parse(JSON.stringify(Level4Coins));
        doorX = 13;
        doorY = 8;
    }

    playerX = 0;
    playerY = 0;
}

// Funktion zur Handhabung der Pfeiltasten
function handleKeyPress(event) {
    if (NO_ENTRY_ZONES.length > 0) {
        switch (event.key) {
            case "ArrowUp":
                movePlayer(0, -1);
                break;
            case "ArrowDown":
                movePlayer(0, 1);
                break;
            case "ArrowLeft":
                movePlayer(-1, 0);
                break;
            case "ArrowRight":
                movePlayer(1, 0);

                break;
        }
        schritte.innerHTML = steps;
    }
}

function movePlayer(dx, dy) {
    const newX = playerX + dx;
    const newY = playerY + dy;

    // Überprüfung, ob die neue Position gültig ist und nicht in den verbotenen Zonen liegt
    if (
        newX >= 0 &&
        newX <= Math.floor(CANVAS_WIDTH / FIELD_SIZE - 1) &&
        newY >= 0 &&
        newY <= Math.floor(CANVAS_HEIGHT / FIELD_SIZE - 1) &&
        !NO_ENTRY_ZONES.some((zone) => zone.x === newX && zone.y === newY)
    ) {
        if (doorX === newX && doorY === newY) {
            if (doorOpen) {
                playerX = newX;
                playerY = newY;
                steps++;
            }
        } else {
            playerX = newX;
            playerY = newY;
            steps++;
        }

        checkIfCoin();
    } else {
        playerX = 0;
        playerY = 0;
    }
}

function checkIfCoin() {
    const coinIndex = Coin_list.findIndex(
        (coin) => coin.x === playerX && coin.y === playerY
    );

    if (coinIndex >= 0) {
        Coin_list.splice(coinIndex, 1);
        coin_count++;
        count.innerHTML = coin_count;
    }
}

function updateNoEntryZones(newZone) {
    NO_ENTRY_ZONES.push(newZone);
    console.log("Aktuelle verbotene Zonen:", NO_ENTRY_ZONES);
}

canvas.addEventListener("mousedown", function (e) {
    getCursorPosition(canvas, e);
});

function checkifGoal() {
    if (playerX === GoalCoordsX && playerY === GoalCoordsY) {
        console.log("GOAL");
        playerX = StartCoords;
        playerY = StartCoords;

        firework_enable = true;
    }
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Berechnung der Feldkoordinaten
    const fieldX = Math.floor(x / FIELD_SIZE);
    const fieldY = Math.floor(y / FIELD_SIZE);

    // Überprüfung, ob das Feld in der verbotenen Zone liegt
    const zoneIndex = NO_ENTRY_ZONES.findIndex(
        (zone) => zone.x === fieldX && zone.y === fieldY
    );

    if (zoneIndex !== -1) {
        // Wenn das Feld bereits in der NO_ENTRY_ZONES-Liste ist, entferne es
        NO_ENTRY_ZONES.splice(zoneIndex, 1);
        console.log("Feld aus verbotener Zone entfernt:", fieldX, fieldY);
    } else {
        // Speichern der neuen Koordinate als verbotene Zone, falls es noch nicht das Ziel oder die Spielerposition ist
        if (
            (fieldX !== playerX || fieldY !== playerY) &&
            (fieldX !== GoalCoordsX || fieldY !== GoalCoordsY)
        ) {
            updateNoEntryZones({ x: fieldX, y: fieldY });
        }
    }
}

function checkIfdoorOpen() {
    if (Coin_list.length <= 0) {
        doorOpen = true;
    }
}

function cleanup() {
    NO_ENTRY_ZONES = [];
    firework_enable = false;
    Coin_list = [];
    playerX = 0;
    playerY = 0;
    steps = 0;
    coin_count = 0;
    doorOpen = false;
    schritte.innerHTML = steps;
    count.innerHTML = coin_count;
}

// Haupt-Spiel-Schleife
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGame();
    checkIfdoorOpen();
    checkifGoal();
    if (firework_enable) animate_firework();
    requestAnimationFrame(gameLoop);
}

// Ereignis-Handler für Pfeiltasten
document.addEventListener("keydown", handleKeyPress);

// Initialisierung und Start des Spiels
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
NO_ENTRY_ZONES = Level1coords;
Coin_list = JSON.parse(JSON.stringify(Level1Coins)); // Tiefe Kopie erstellen
drawGrid();
gameLoop();

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.sx = Math.random() * 3 - 1.5;
        this.sy = Math.random() * -3 - 3;
        this.size = Math.random() * 2 + 3;
        const colorVal = Math.round(0xffffff * Math.random());
        [this.r, this.g, this.b] = [
            colorVal >> 16,
            (colorVal >> 8) & 255,
            colorVal & 255,
        ];
        this.shouldExplode = false;
    }
    update() {
        this.shouldExplode =
            this.sy >= -2 ||
            this.y <= 100 ||
            this.x <= 0 ||
            this.x >= canvas.width;
        this.sy += 0.01;
        [this.x, this.y] = [this.x + this.sx, this.y + this.sy];
    }
    draw() {
        ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Particle {
    constructor(x, y, r, g, b) {
        [this.x, this.y, this.sx, this.sy, this.r, this.g, this.b] = [
            x,
            y,
            Math.random() * 3 - 1.5,
            Math.random() * 3 - 1.5,
            r,
            g,
            b,
        ];
        this.size = Math.random() * 2 + 3;
        this.life = 100;
    }
    update() {
        [this.x, this.y, this.life] = [
            this.x + this.sx,
            this.y + this.sy,
            this.life - 1,
        ];
    }
    draw() {
        ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${
            this.life / 100
        })`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const fireworks = [new Firework()];
const particles = [];

function animate_firework() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Math.random() < 0.25 && fireworks.push(new Firework()); //Controlling the number of fireworks
    fireworks.forEach((firework, i) => {
        firework.update();
        firework.draw();
        if (firework.shouldExplode) {
            for (let j = 0; j < 50; j++)
                particles.push(
                    new Particle(
                        firework.x,
                        firework.y,
                        firework.r,
                        firework.g,
                        firework.b
                    )
                );
            fireworks.splice(i, 1);
        }
    });
    particles.forEach((particle, i) => {
        particle.update();
        particle.draw();
        if (particle.life <= 0) particles.splice(i, 1);
    });
}
