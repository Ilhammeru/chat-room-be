import { Server as HTTPServer } from "http";
import { Server } from "socket.io";
import { SocketUserDto } from "../types/socker-user.dto";
import { SendMessageDto } from "../types/send-message.dto";
import { RetrieveMessageDto } from "../types/retrieve-message.dto";

let io: Server;
let users: SocketUserDto[] = [];
let roomNames: string[] = [];

function setRoomName(senderId: number, targetId: number): string {
    // Validate sender and target user IDs
    const checkSender = users.find((user: SocketUserDto) => user.userId === senderId);
    const checkTarget = users.find((user: SocketUserDto) => user.userId === targetId);

    if (!checkSender || !checkTarget) {
        console.warn('Sender and target should have active session');
    }

    const ids = [senderId, targetId].sort((a, b) => a - b);
    const roomName = `user-room:${ids[0]}:${ids[1]}`;

    if (!roomNames.includes(roomName)) {
        roomNames.push(roomName);

    }
    // Join socket to the room
    const senderSocketId = getUserSocketId(senderId);
    const targetSocketId = getUserSocketId(targetId);

    if (senderSocketId) {
        io.sockets.sockets.get(senderSocketId)?.join(roomName);
    }

    if (targetSocketId) {
        io.sockets.sockets.get(targetSocketId)?.join(roomName);
    }

    return roomName;
}

function getUserSocketId(userId: number): string | null {
    const user = users.find((user: SocketUserDto) => user.userId === userId);
    return user ? user.socketId : null;
}

function setUsers(userId: number, socketId: string): void {
    const existingUserIndex = users.findIndex((user: SocketUserDto) => user.userId === userId);

    if (existingUserIndex !== -1) {
        users[existingUserIndex].socketId = socketId;
    } else {
        users.push({ userId, socketId });
    }
}

export function initSockets(httpServer: HTTPServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5175",
            methods: ["GET", "POST"],
            credentials: true,
            allowedHeaders: ["*"]
        }
    });
    
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
            users = users.filter((user: SocketUserDto) => user.socketId !== socket.id);
            roomNames = roomNames.filter((roomName) => !roomName.includes(socket.id));
        });

        socket.on('reset-user', (contactId: number) => {
            const user = users.find((user: SocketUserDto) => user.socketId === socket.id);
            if (! user) {
                users.push({ userId: contactId, socketId: socket.id });
            }
        })

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socket.on('register_user', (senderId: number, targetId: number) => {
            let senderSocket = getUserSocketId(senderId);
            let targetSocket = getUserSocketId(targetId);

            if (! senderSocket) senderSocket = socket.id;

            // Set users
            setUsers(senderId, senderSocket);

            if (targetSocket) { // Do not register socket id to target user if target user is not connected
                setUsers(targetId, targetSocket);
            }

            const roomName = setRoomName(senderId, targetId);

            if (roomName !== '') {
                io.to(roomName).emit('joined_room', {
                    message: `You have joined the room ${roomName}`,
                });
            }
        });
        
        socket.on('send-message', (data: SendMessageDto) => {
            const { message, roomName, senderId, targetId } = data;

            const payload: RetrieveMessageDto = {
                id: 0,
                text: message,
                senderId,
                targetId,
                timestamp: new Date().toISOString()
            }

            io.to(roomName).emit('retrieve-message', payload);
        });

        socket.on('reset-connection', (userId: number) => {
            console.log("reset connection from unmounted", userId);
        });
    });

    io.on('error', (error) => {
        console.error('Socket.IO error:', error);
    });
    
    io.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
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