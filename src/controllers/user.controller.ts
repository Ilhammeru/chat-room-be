import { Request, Response } from 'express';
import { Contact } from '../types/contact.dto';

export class UserController {
    getUserList(_req: Request, res: Response): Response<Contact[]> {
        const response: Contact[] = [
            {
                id: 1,
                name: 'Alice',
                avatar: 'https://i.pravatar.cc/150?img=1',
                lastMessage: 'Hey there!',
                online: true,
                lastActive: '28 minutes ago'
            },
            {
                id: 2,
                name: 'Bob',
                avatar: 'https://i.pravatar.cc/150?img=2',
                lastMessage: 'What\'s up?',
                online: false,
                lastActive: '2 hours ago'
            },
            {
                id: 3,
                name: 'Charlie',
                avatar: 'https://i.pravatar.cc/150?img=3',
                lastMessage: 'Let\'s catch up later.',
                online: true,
                lastActive: '5 minutes ago'
            }
        ];

        return res.json(response);
    }

    // setUserSocket(userId: number) {
    //     const socket = 
    // }
}