const express = require("express");
const mongoose = require("mongoose");
const http = require('http'); 
const { Server } = require("socket.io"); 
const cors = require('cors'); // Import cors middleware
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const faqRoutes = require('./routes/faqRoutes');
const productRoutes = require('./routes/productRoutes');
const productReportRoutes = require('./routes/productReportRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const appReviewRoutes = require('./routes/appReviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const userInteractionRoutes = require('./routes/userInteractionRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const server = http.createServer(app);

// Set up CORS middleware for HTTP requests
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://your-production-url.com' : 'http://localhost:3000', // Allow frontend requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});


// Socket.io configuration to allow WebSocket connections with CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow WebSocket connections from frontend
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Global middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Use the routes
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reports', productReportRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', favoriteRoutes);
app.use('/api/app-reviews', appReviewRoutes);
app.use('/api/contact', contactRoutes);
// app.use('/api', userRoutes);  // Prefix routes with /api
app.use('/api/recommendations', recommendationRoutes);  // Recommendations endpoint for recommendation thingy 
app.use('/api/interactions', userInteractionRoutes);     // Track interactions endpoint 


// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join room for buyer and seller chat
    socket.on('join-room', ({ roomId }) => {
        socket.join(roomId); // User joins the room
        console.log(`User joined room: ${roomId}`);
    });

    // Listen for 'send-message' event from client
    socket.on('send-message', ({ roomId, message }) => {
        // Broadcast the message to the room
        io.to(roomId).emit('receive-message', message);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Connect to the database and start the server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(process.env.PORT, () => {
            console.log("Connected to db & Listening on port", process.env.PORT);
        });
    })
    .catch((error) => {
        console.log("Error connecting to database:", error);
    });
