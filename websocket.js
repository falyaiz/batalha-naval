let ws;
let isMyTurn = false;
let myPlayerId = null;

function setupWebSocket() {
    ws = new WebSocket('wss://batalha-naval-server.glitch.me');
    ws.onopen = () => {
        document.getElementById('status').textContent = 'Conectado! Aguardando oponente...';
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'connected':
                myPlayerId = data.playerId;
                document.getElementById('status').textContent = 'Conectado! Aguardando oponente...';
                initBoards();
                break;
            case 'start':
                myPlayerId = data.playerId;
                isMyTurn = data.first && data.turn === myPlayerId;
                document.getElementById('status').textContent = 
                    isMyTurn ? 'Seu turno!' : 'Turno do oponente!';
                updateTurnIndicator();
                break;
            case 'turn':
                isMyTurn = data.turn === myPlayerId;
                document.getElementById('status').textContent = 
                    isMyTurn ? 'Seu turno!' : 'Turno do oponente!';
                updateTurnIndicator();
                break;
            case 'attack':
                if (data.hit) {
                    opponentBoard[data.x][data.y] = 1;
                } else {
                    opponentBoard[data.x][data.y] = 2;
                }
                renderBoards();
                break;
            case 'defend':
                let hit = playerBoard[data.x][data.y] === 1;
                if (hit) playerBoard[data.x][data.y] = 2;
                renderBoards();
                ws.send(JSON.stringify({ type: 'response', x: data.x, y: data.y, hit }));
                break;
            case 'win':
                alert('Você venceu!');
                break;
            case 'lose':
                alert('Você perdeu!');
                break;
            case 'error':
                alert(data.message);
                break;
            case 'opponentDisconnected':
                alert('Oponente desconectado!');
                break;
        }
    };

    ws.onclose = () => {
        document.getElementById('status').textContent = 'Desconectado';
    };
}

function updateTurnIndicator() {
    const turnIndicator = document.getElementById('turn-indicator');
    turnIndicator.textContent = isMyTurn ? 'Seu Turno!' : 'Turno do Oponente';
    turnIndicator.classList.toggle('active', isMyTurn);
}
