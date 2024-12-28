import WebSocket from 'ws';

const ws = new WebSocket('wss://algo360fx-server.onrender.com/ws', {
    headers: {
        'Origin': 'https://algo360fx-client.onrender.com'
    }
});

ws.on('open', () => {
    console.log('Connected to WebSocket server');
    ws.send(JSON.stringify({
        type: 'ping',
        data: { timestamp: Date.now() }
    }));
});

ws.on('message', (data) => {
    console.log('Received:', data.toString());
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.on('close', () => {
    console.log('Disconnected from WebSocket server');
});

// Close after 5 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 5000);
