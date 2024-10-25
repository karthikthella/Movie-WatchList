const express = require('express');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
  
    if (!token) return res.sendStatus(401); 
  

    jwt.verify(token, 'darcylewis123', (err, user) => {
      if (err) {
        console.error("Token verification failed:", err); 
        return res.sendStatus(403);
      }
      req.user = user; 
      next(); 
    });
  };

  router.post('/watchlist', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, title, rating, genres, cast, image, year } = req.body;

        console.log("Incoming data:", req.body);

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const movieExists = user.watchlist.find(movie => movie.id === id);
        if (movieExists) {
            return res.status(400).json({ error: 'Movie already in watchlist' });
        }

        const newMovie = { id, title, rating, genres, cast, image, year };

        user.watchlist.push(newMovie);

        await user.save(); 
        res.status(201).json({ message: 'Movie added to watchlist', watchlist: user.watchlist });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/watched', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, rating, genres, cast, image, year } = req.body;

    if(!title) return res.status(400).json({ error: "Title is required" });

    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ error: "User not found" });

    const movieExists = user.watched.find(movie => movie.id === id);
    if(movieExists) return res.status(400).json({ error: 'Movie already in watched' });

    const newMovie = { id, title, rating, genres, cast, image, year };

    user.watched.push(newMovie);

    await user.save(); 
    res.status(201).json({ message: 'Movie added to watched', watched: user.watched });
  }
  catch(error){
    console.error("Error adding to watched:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/watched', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id; 

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ watched: user.watched });
  } catch (error) {
      console.error('Error fetching watched:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

router.get('/watchlist', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id; 

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      
      res.status(200).json({ watchlist: user.watchlist });
  } catch (error) {
      console.error('Error fetching watchlist:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/watched/:id', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id; 
      const movieId = req.params.id; 

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      
      user.watched = user.watched.filter(movie => movie.id !== movieId);

      await user.save(); 
      res.status(200).json({ message: 'Movie removed from watched', watched: user.watched });
  } catch (error) {
      console.error('Error removing movie from watched:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/watchlist/:id', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id; 
      const movieId = req.params.id; 

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      
      user.watchlist = user.watchlist.filter(movie => movie.id !== movieId);

      await user.save(); 
      res.status(200).json({ message: 'Movie removed from watchlist', watchlist: user.watchlist });
  } catch (error) {
      console.error('Error removing movie from watchlist:', error);
      res.status(500).json({ error: 'Server error' });
  }
});


  

module.exports = router;
