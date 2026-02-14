import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

// User routes
router.get(
    '/',
    (req, res) => userController.getUserList(req, res)
);

export default router;
