const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws', {
    headers: {
        'Origin': 'http://localhost:3000'
    }
});

ws.on('open', () => {
    console.log('Connected to WebSocket server');
    
    // Test trading messages
    ws.send(JSON.stringify({
        type: 'placeOrder',
        symbol: 'EURUSD',
        orderType: 'market',
        side: 'buy',
        quantity: 1.0
    }));

    // Test optimization messages
    setTimeout(() => {
        ws.send(JSON.stringify({
            type: 'startOptimization',
            strategy: 'MovingAverageCrossover',
            parameters: {
                timeframe: 'H1',
                symbol: 'EURUSD',
                startDate: '2023-01-01',
                endDate: '2023-12-31'
            }
        }));
    }, 1000);
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
