const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const router = express.Router();
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => { 
    const { firstname, lastname, username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, username, email, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: 'User created successfully' }); 
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/signin', async (req, res) => { 
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User does not exist' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' }); 

        const token = jwt.sign({ id: user._id }, 'darcylewis123', { expiresIn: '10h' });
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                firstname: user.firstname, 
                lastname: user.lastname,
            }
        });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
