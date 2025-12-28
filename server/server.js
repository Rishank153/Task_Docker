const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketio = require('socket.io');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const seedAdmin = require('./seed');
seedAdmin();

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin:  "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});


// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));



// Handle SPA (should be last route)


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});