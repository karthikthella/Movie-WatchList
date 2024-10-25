const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/users')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is runnign on port ${PORT}`));