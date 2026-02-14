import { Request, Response } from 'express';
import { emitEvent, listenSpecificEvent } from '../utils/socket';
import { SetupListenerDto } from '../types/setup-listener-payload.dto';

export class MessageController {
    
    // Send a message to all connected clients
    sendMessage(_req: Request, res: Response) {
        const { message, user, eventName } = _req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Emit the message to all connected Socket.IO clients
        emitEvent(eventName || 'new-message', {
            user: user || 'Anonymous',
            message,
            timestamp: new Date().toISOString()
        });

        return res.json({ 
            success: true,
            message: 'Message sent to all clients' 
        });
    }

    // Setup message listener
    setupListener(req: SetupListenerDto, res: Response) {
        console.log('req', req.userId);
        listenSpecificEvent('message-' + req.userId, (data) => {
            console.log('Received chat message:', data);


            // STORE TO DB IF NEEDED
            
            // Send to target user
            this.sendMessage({
                body: {
                    message: data.message,
                    user: data.user,
                    eventName: 'message-' + data.targetUserId
                }
            } as Request, res);
        });

        return res.json({ 
            success: true,
            message: 'Listener setup complete' 
        });
    }
}
