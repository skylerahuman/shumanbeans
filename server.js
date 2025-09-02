import { handler } from './.svelte-kit/output/server/index.js';
import express from 'express';
import { webcrypto } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

// Make crypto available globally for SvelteKit (Node.js 18+ compatibility)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

// Serve static files from the built client directory
app.use(express.static(path.join(__dirname, '.svelte-kit', 'output', 'client'), {
  maxAge: '1y',
  etag: false
}));

// Serve static files from the static directory
app.use(express.static(path.join(__dirname, 'static'), {
  maxAge: '1y',
  etag: false
}));

// Handle all requests with SvelteKit handler
app.use(handler);

app.listen(PORT, HOST, () => {
  console.log(`🚀 Shumanbeans wedding website running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
