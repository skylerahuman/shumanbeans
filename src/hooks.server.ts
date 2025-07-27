import type { Handle } from '@sveltejs/kit';
import { initializeSocketIO } from '$lib/server/socket';
import { building } from '$app/environment';

let socketInitialized = false;

export const handle: Handle = async ({ event, resolve }) => {
  // Initialize Socket.io server if not building and not already initialized
  if (!building && !socketInitialized && event.platform?.server) {
    initializeSocketIO(event.platform.server);
    socketInitialized = true;
  }

  return resolve(event);
};
