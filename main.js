import {
    Level1coords,
    Level2coords,
    Level3coords,
    Level4coords,
} from "./Levelcoords";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var img = document.getElementById("maus");

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
    NO_ENTRY_ZONES = [];
    firework_enable = false;
};

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

//Player image
let image_path_maus = "assets/maus.png"; // Bildpfad (falls notwendig)
let image_path_chesse = "assets/chesse.png";

let NO_ENTRY_ZONES = [];

const GoalCoordsX = 13;
const GoalCoordsY = 9;

// Bild direkt laden
const mausImage = new Image();
mausImage.src = image_path_maus;

const chesseImage = new Image();
chesseImage.src = image_path_chesse;

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

function drawWall() {
    ctx.fillStyle = "grey";

    NO_ENTRY_ZONES.forEach((zone) => {
        const x = zone.x * 100;
        const y = zone.y * 100;

        // Zeichnen der Wand für diese Zone
        ctx.fillRect(x, y, FIELD_SIZE, FIELD_SIZE);
    });
}

function LevelPress(level) {
    if (level == "level1") NO_ENTRY_ZONES = Level1coords;
    if(level == "level2") NO_ENTRY_ZONES = Level2coords;
    if(level == "level3") NO_ENTRY_ZONES = Level3coords;
    if(level == "level4") NO_ENTRY_ZONES = Level4coords
}



// Funktion zur Handhabung der Pfeiltasten
function handleKeyPress(event) {
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
        playerX = newX;
        playerY = newY;
        console.log("y: ", playerY);
        console.log("x: ", playerX);
    } else {
        console.log("Position ungültig oder verboten, Bewegung abgebrochen.");
        playerX = 0;
        playerY = 0;
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

    console.log("x: " + x + " y: " + y);

    // Berechnung der Feldkoordinaten
    const fieldX = Math.floor(x / FIELD_SIZE);
    const fieldY = Math.floor(y / FIELD_SIZE);

    console.log("Geklicktes Feld:", fieldX, fieldY);
    console.log(playerX);

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
            (fieldX !== 9 || fieldY !== 9)
        ) {
            updateNoEntryZones({ x: fieldX, y: fieldY });
        }
    }
}

// Haupt-Spiel-Schleife
function gameLoop() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGrid();
    drawGoalImage();
    drawPlayerImage();
    drawWall();
    checkifGoal();
    if (firework_enable) animate_firework();
    requestAnimationFrame(gameLoop);
}

// Ereignis-Handler für Pfeiltasten
document.addEventListener("keydown", handleKeyPress);

// Initialisierung und Start des Spiels
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
drawGrid();
gameLoop();

class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.sx = Math.random() * 3 - 1.5;
        this.sy = Math.random() * -3 - 3;
        this.size = Math.random() * 2 + 1;
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
        this.size = Math.random() * 2 + 1;
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
