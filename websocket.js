let ws;
function setupWebSocket() {
    ws = new WebSocket('wss://batalha-naval-server.glitch.me');
    ws.onopen = () => {
        document.getElementById('status').textContent = 'Conectado! Aguardando oponente...';
        initBoards();
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'start':
                isMyTurn = data.first;
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
                isMyTurn = true;
                document.getElementById('status').textContent = 'Seu turno!';
                updateTurnIndicator();
                break;
            case 'defend':
                let hit = playerBoard[data.x][data.y] === 1;
                if (hit) playerBoard[data.x][data.y] = 2;
                renderBoards();
                ws.send(JSON.stringify({ type: 'response', x: data.x, y: data.y, hit }));
                isMyTurn = false;
                document.getElementById('status').textContent = 'Turno do oponente!';
                updateTurnIndicator();
                break;
            case 'win':
                alert('Você venceu!');
                break;
            case 'lose':
                alert('Você perdeu!');
                break;
        }
    };

    ws.onclose = () => {
        document.getElementById('status').textContent = 'Desconectado';
    };
}
