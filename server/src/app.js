const express = require('express');
const cors = require('cors');
const clientRoutes = require('./routes/clientRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000' // Next.js dev
}));
app.use(express.json());

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
