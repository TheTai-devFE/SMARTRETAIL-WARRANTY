// Server v2.0 update
require('dotenv').config({ override: true });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const warrantyRoutes = require('./routes/warrantyRoutes');

const app = express();
console.log('Server is restarting... Loading new Hardware/Software modules...');
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Routes
const softwareRoutes = require('./routes/softwareRoutes');
const searchRoutes = require('./routes/searchRoutes');
const repairRoutes = require('./routes/repairRequestRoutes');

app.use('/api', warrantyRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/repair-requests', repairRoutes);

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
