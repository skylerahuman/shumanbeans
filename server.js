import { Server } from './.svelte-kit/output/server/index.js';
import { manifest } from './.svelte-kit/output/server/manifest.js';
import { createServer } from 'http';
import { webcrypto } from 'crypto';

// Make crypto available globally for SvelteKit (Node.js 18+ compatibility)
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto;
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  const server = new Server(manifest);

  // Initialize the server with environment variables
  await server.init({
    env: process.env
  });

  // Create HTTP server
  const httpServer = createServer(async (req, res) => {
    // Convert Node.js request/response to Web API Request/Response
    const url = `http://${req.headers.host}${req.url}`;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined
    });

    try {
      const response = await server.respond(request, {
        getClientAddress: () => {
          return req.socket.remoteAddress || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        }
      });

      // Copy response to Node.js response object
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
    } catch (error) {
      console.error('Server error:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  });

  // Start the server
  httpServer.listen(PORT, HOST, () => {
    console.log(`🚀 Shumanbeans wedding website running at http://${HOST}:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    httpServer.close(() => {
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    httpServer.close(() => {
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
