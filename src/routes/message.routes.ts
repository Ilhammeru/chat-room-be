import { Router } from 'express';
import { MessageController } from '../controllers/message.controller';

const router = Router();
const messageController = new MessageController();

// Send message via REST API (will broadcast via Socket.IO)
router.post('/send', (req, res) => messageController.sendMessage(req, res));

// Setup listener
router.post('/setup-listener', (req, res) => messageController.setupListener(req.body, res));

export default router;
