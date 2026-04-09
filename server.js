console.log("🔥 SERVER FILE STARTED");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  console.log("🔥 ROOT ROUTE HIT");
  res.send("AgriAI Backend Running 🚀");
});

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log(err));

// 🚀 SERVER START (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});