const GRID_SIZE = 10;
let playerBoard = [];
let opponentBoard = [];
let isMyTurn = false;

function initBoards() {
    for (let i = 0; i < GRID_SIZE; i++) {
        playerBoard[i] = new Array(GRID_SIZE).fill(0);
        opponentBoard[i] = new Array(GRID_SIZE).fill(0);
    }
    renderBoards();
    placeShips();
}

function renderBoards() {
    const playerGrid = document.getElementById('playerGrid');
    const opponentGrid = document.getElementById('opponentGrid');
    
    playerGrid.innerHTML = '';
    opponentGrid.innerHTML = '';

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            let playerCell = document.createElement('div');
            playerCell.className = 'cell';
            if (playerBoard[i][j] === 1) playerCell.classList.add('ship');
            playerGrid.appendChild(playerCell);

            let opponentCell = document.createElement('div');
            opponentCell.className = 'cell';
            opponentCell.onclick = () => attack(i, j);
            if (opponentBoard[i][j] === 1) opponentCell.classList.add('hit');
            if (opponentBoard[i][j] === 2) opponentCell.classList.add('miss');
            opponentGrid.appendChild(opponentCell);
        }
    }
}

function placeShips() {
    const ships = [5, 4, 3, 3, 2];
    ships.forEach(size => {
        let placed = false;
        while (!placed) {
            let direction = Math.random() > 0.5 ? 'h' : 'v';
            let x = Math.floor(Math.random() * GRID_SIZE);
            let y = Math.floor(Math.random() * GRID_SIZE);
            
            if (canPlaceShip(x, y, size, direction)) {
                placeShip(x, y, size, direction);
                placed = true;
            }
        }
    });
    renderBoards();
}

function canPlaceShip(x, y, size, direction) {
    if (direction === 'h') {
        if (y + size > GRID_SIZE) return false;
        for (let i = 0; i < size; i++) {
            if (playerBoard[x][y + i] !== 0) return false;
        }
    } else {
        if (x + size > GRID_SIZE) return false;
        for (let i = 0; i < size; i++) {
            if (playerBoard[x + i][y] !== 0) return false;
        }
    }
    return true;
}

function placeShip(x, y, size, direction) {
    if (direction === 'h') {
        for (let i = 0; i < size; i++) {
            playerBoard[x][y + i] = 1;
        }
    } else {
        for (let i = 0; i < size; i++) {
            playerBoard[x + i][y] = 1;
        }
    }
}

function attack(x, y) {
    if (!isMyTurn) {
        alert("Não é seu turno!");
        return;
    }
    ws.send(JSON.stringify({ type: 'attack', x, y }));
}

document.addEventListener('DOMContentLoaded', () => {
    setupWebSocket();

    // Criar camadas animadas
    const oceanBg = document.getElementById('ocean-background');

    const skyLayer = document.createElement('div');
    skyLayer.id = 'sky-layer';
    skyLayer.className = 'parallax-layer';
    oceanBg.appendChild(skyLayer);

    const waterLayer = document.createElement('div');
    waterLayer.id = 'water-layer';
    waterLayer.className = 'parallax-layer';
    oceanBg.appendChild(waterLayer);

    const waveLayer = document.createElement('div');
    waveLayer.id = 'wave-layer';
    waveLayer.className = 'parallax-layer';
    oceanBg.appendChild(waveLayer);

    // Animação manual (opcional, já que CSS cobre isso)
    // Removido para evitar duplicação com CSS
});