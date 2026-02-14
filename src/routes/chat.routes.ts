import { Router } from 'express';

const router = Router();

// Chat room routes
router.get('/rooms', (_req, res) => {
    res.json({
        rooms: [
            { id: 1, name: 'General', users: 5 },
            { id: 2, name: 'Tech Talk', users: 3 },
            { id: 3, name: 'Random', users: 8 }
        ]
    });
});

export default router;
