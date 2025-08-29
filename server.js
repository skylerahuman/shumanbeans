// server.js
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { i as initializeSocketIO } from './.svelte-kit/output/server/chunks/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.IO
initializeSocketIO(server);

// Middleware
app.use(express.json());

// Serve static files from SvelteKit build output
app.use(express.static(join(__dirname, '.svelte-kit/output/client')));

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Intent API endpoint
app.post('/api/intent', (req, res) => {
  const { intent } = req.body;
  
  if (!intent) {
    return res.status(400).json({ 
      error: 'Intent is required',
      result: null 
    });
  }
  
  // Simulate processing delay
  setTimeout(() => {
    // Mock response based on intent content
    let result = `Received intent: ${intent}`;
    let actions = [];
    
    // Simple intent processing simulation
    if (intent.toLowerCase().includes('email')) {
      actions = [
        'Analyzing email content...',
        'Preparing draft...',
        'Email sent successfully ✓'
      ];
      result = 'Email task completed';
    } else if (intent.toLowerCase().includes('summarize') || intent.toLowerCase().includes('summary')) {
      actions = [
        'Gathering information...',
        'Processing content...',
        'Summary generated ✓'
      ];
      result = 'Summary task completed';
    } else if (intent.toLowerCase().includes('schedule') || intent.toLowerCase().includes('meeting')) {
      actions = [
        'Checking calendar availability...',
        'Finding optimal time slots...',
        'Meeting scheduled ✓'
      ];
      result = 'Scheduling task completed';
    } else {
      actions = [
        'Processing request...',
        'Task completed ✓'
      ];
    }
    
    res.json({ 
      result,
      actions,
      timestamp: new Date().toISOString(),
      status: 'success'
    });
  }, 1000);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Catch-all handler for SvelteKit routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '.svelte-kit/output/client', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

server.listen(PORT, () => {
  console.log(`💕 Shumanbeans Wedding Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/intent`);
  console.log(`🎯 Health check at http://localhost:${PORT}/api/health`);
  console.log(`🌐 Date Poll available at http://localhost:${PORT}/date-poll`);
});
