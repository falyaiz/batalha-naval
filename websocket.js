// websocket.js
let ws;
let isMyTurn = false; // Declarado apenas aqui
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
 initBoards(); // Chama initBoards de game.js
 ws.send(JSON.stringify({ type: 'placeShips', board: playerBoard }));
 break;
 case 'start':
 isMyTurn = data.first; // Jogador 1 começa
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
 case 'defend':
 let hit = playerBoard[data.x][data.y] === 1;
 if (hit) playerBoard[data.x][data.y] = 2; // Marca como atingido
 ws.send(JSON.stringify({ type: 'response', x: data.x, y: data.y, hit }));
 renderBoards();
 break;
 case 'attackResult': // Renomeado para corresponder ao cliente
 if (data.hit) {
 opponentBoard[data.x][data.y] = 1; // Acerto
 } else {
 opponentBoard[data.x][data.y] = 2; // Erro
 }
 renderBoards();
 break;
 case 'win':
 alert('Você venceu!');
 document.getElementById('status').textContent = 'Você venceu!';
 break;
 case 'lose':
 alert('Você perdeu!');
 document.getElementById('status').textContent = 'Você perdeu!';
 break;
 case 'error':
 alert(data.message);
 break;
 case 'opponentDisconnected':
 alert('Oponente desconectado!');
 document.getElementById('status').textContent = 'Oponente desconectado!';
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

// Exporta para o escopo global
window.setupWebSocket = setupWebSocket;
window.updateTurnIndicator = updateTurnIndicator;
window.ws = ws; // Não é necessário, mas mantido para compatibilidade
window.isMyTurn = isMyTurn;
window.myPlayerId = myPlayerId;
