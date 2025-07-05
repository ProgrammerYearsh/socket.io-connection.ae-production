import { Socket as DefaultSocket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    user?: {
      id: string;
      firstName : string; 
      lastName : string; 
    };
  }
}
