import WebSocket from 'ws';

const ws = new WebSocket('wss://algo360fx-server.onrender.com/ws');

ws.on('open', () => {
    console.log('Connected to WebSocket server');
    // Send a test message
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

// Close the connection after 5 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 5000);
