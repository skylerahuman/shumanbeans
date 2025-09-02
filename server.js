import { Server } from './.svelte-kit/output/server/index.js';
import { manifest } from './.svelte-kit/output/server/manifest.js';
import { webcrypto } from 'crypto';

// Make crypto available globally for SvelteKit (Node.js 18+ compatibility)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = new Server(manifest);

async function startServer() {
  // Initialize the SvelteKit server
  await server.init({
    env: process.env
  });

  const httpServer = new Server(manifest);
  
  await httpServer.init({
    env: process.env
  });

  // Use the built-in server with proper static file handling
  const { createServer } = await import('http');
  
  const nodeServer = createServer(async (req, res) => {
    const request = new Request(`http://${req.headers.host}${req.url}`, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined
    });

    const response = await httpServer.respond(request, {
      getClientAddress: () => {
        return req.socket.remoteAddress || req.connection.remoteAddress || req.headers['x-forwarded-for'];
      }
    });

    res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    
    if (response.body) {
      const reader = response.body.getReader();
      const pump = async () => {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
        } else {
          res.write(new Uint8Array(value));
          return pump();
        }
      };
      await pump();
    } else {
      res.end();
    }
  });

  nodeServer.listen(PORT, HOST, () => {
    console.log(`🚀 Shumanbeans wedding website running at http://${HOST}:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    nodeServer.close(() => process.exit(0));
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    nodeServer.close(() => process.exit(0));
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
