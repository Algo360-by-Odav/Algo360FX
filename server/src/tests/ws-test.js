import WebSocket from 'ws';

console.log('Starting WebSocket test...');
console.log('Connecting to wss://algo360fx-server.onrender.com/ws');

const ws = new WebSocket('wss://algo360fx-server.onrender.com/ws', {
    headers: {
        'Origin': 'https://algo360fx-client.onrender.com'
    },
    rejectUnauthorized: false
});

ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
    // Send a test message
    const message = {
        type: 'ping',
        data: { timestamp: Date.now() }
    };
    console.log('Sending message:', message);
    ws.send(JSON.stringify(message));
});

ws.on('message', (data) => {
    console.log('Received message:', data.toString());
    try {
        const parsed = JSON.parse(data.toString());
        console.log('Parsed message:', parsed);
    } catch (error) {
        console.error('Error parsing message:', error);
    }
});

ws.on('ping', () => {
    console.log('Received ping from server');
    ws.pong();
});

ws.on('pong', () => {
    console.log('Received pong from server');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    if (error.code) {
        console.error('Error code:', error.code);
    }
    if (error.message) {
        console.error('Error message:', error.message);
    }
});

ws.on('close', (code, reason) => {
    console.log('WebSocket closed');
    console.log('Close code:', code);
    console.log('Close reason:', reason.toString());
});

// Keep the connection open for 10 seconds
setTimeout(() => {
    console.log('Test complete, closing connection');
    ws.close();
    process.exit(0);
}, 10000);
