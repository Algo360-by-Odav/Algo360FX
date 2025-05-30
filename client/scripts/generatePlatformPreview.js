const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create canvas
const canvas = createCanvas(1200, 800);
const ctx = canvas.getContext('2d');

// Set background
ctx.fillStyle = '#1A2C42';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Draw header
ctx.fillStyle = '#243B55';
ctx.fillRect(0, 0, canvas.width, 60);

// Draw sidebar
ctx.fillStyle = '#243B55';
ctx.fillRect(0, 60, 200, canvas.height - 60);

// Draw main chart area background
ctx.fillStyle = '#1E2A3B';
ctx.fillRect(210, 70, 970, 400);

// Draw mock candlesticks
ctx.strokeStyle = '#4CAF50';
ctx.lineWidth = 2;
let x = 230;
for (let i = 0; i < 50; i++) {
  const height = Math.random() * 200 + 100;
  const y = 270;
  // Candle body
  ctx.fillStyle = Math.random() > 0.5 ? '#4CAF50' : '#F44336';
  ctx.fillRect(x, y - height/2, 10, height);
  // Candle wicks
  ctx.beginPath();
  ctx.moveTo(x + 5, y - height/2 - 20);
  ctx.lineTo(x + 5, y + height/2 + 20);
  ctx.stroke();
  x += 18;
}

// Draw order book
ctx.fillStyle = '#1E2A3B';
ctx.fillRect(210, 480, 480, 300);

// Draw trades list
ctx.fillStyle = '#1E2A3B';
ctx.fillRect(700, 480, 480, 300);

// Draw some mock data rows
ctx.fillStyle = '#4CAF50';
for (let i = 0; i < 8; i++) {
  ctx.fillRect(220, 500 + i * 30, 460, 1);
}

ctx.fillStyle = '#F44336';
for (let i = 0; i < 8; i++) {
  ctx.fillRect(710, 500 + i * 30, 460, 1);
}

// Add some text labels
ctx.fillStyle = '#FFFFFF';
ctx.font = '14px Arial';
ctx.fillText('EUR/USD', 220, 90);
ctx.fillText('Order Book', 220, 500);
ctx.fillText('Recent Trades', 710, 500);

// Add some stats
ctx.fillStyle = '#4CAF50';
ctx.fillText('1.2345', 300, 90);
ctx.fillStyle = '#888888';
ctx.fillText('+0.05%', 360, 90);

// Save the image
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, '../public/images/platform-preview.png'), buffer);
console.log('Platform preview image generated successfully!');
