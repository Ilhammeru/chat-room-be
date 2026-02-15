import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import chatRoutes from './routes/chat.routes';
import userRoutes from './routes/user.routes';
import messageRoutes from './routes/message.routes';
import { initSockets } from './utils/socket';

// import { generateTitleCase, countUniqueWordInString, delay, fetchData, processData } from './utils/helpers';

require('dotenv').config();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5175",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// >>>>>>>>>>>>>> TEST RESULT <<<<<<<<<<<<
// console.log('titleCase', generateTitleCase("I'm a little tea pot"));

// console.log('count unique word', countUniqueWordInString("Four One two two three Three three four  four   four"));

// delay(3000).then(() => console.log('runs after 3 seconds'));

// fetchData(null, (err, data) => {
//     if (err) {
//         console.error("Fetch Error:", err);
//     } else {
//         processData(data, (err, processedData) => {
//             if (err) {
//                 console.error("Process Error:", err);
//             } else {
//                 console.log("Processed Data:", processedData);
//             }
//         });
//     }
// });
// >>>>>>>>>>>>>> TEST RESULT <<<<<<<<<<<<

// Create HTTP server from Express app
const httpServer = createServer(app);

initSockets(httpServer);

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Express + Socket.IO server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}`);
});

export {};
