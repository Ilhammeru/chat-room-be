import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

let io: Server;

export function initSockets(httpServer: HTTPServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5175",
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["*"]
        }
    });
    
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}

export function emitEvent(eventName: string, data: any) {
    const io = getIO();
    console.log(`Emitting event ${eventName}:`, data);
    io.emit(eventName, data);
}

export function listenSpecificEvent(eventName: string, callback: (data: any) => void) {
    const io = getIO();
    io.on('connection', (socket) => {
        socket.on(eventName, (data) => {
            callback(data);
        });
    });
}