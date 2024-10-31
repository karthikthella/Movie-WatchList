import { Typography, IconButton } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import QueueIcon from '@mui/icons-material/Queue';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import Tooltip from '@mui/material/Tooltip';
import Navbar from './Navbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MovieCards = ({ text, movies }) => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };
  console.log(movies);

  const removeFromWatchlist = async (movieId) => {
    try {
        const response = await fetch(`https://server-sandy-eta-92.vercel.app/api/user/watchlist/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token in localStorage
            }
        });

        if (!response.ok) {
            throw new Error('Failed to remove movie from watchlist');
        }

        // Update the watchlist locally after successful removal
        setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== movieId));
    } catch (error) {
        console.error('Error removing movie from watchlist:', error);
        setError('Failed to remove movie');
    }
};

  const addToWatched = async (movie) => {
    const token = localStorage.getItem('token');
    console.log(token);
    const movieDetails = {
      id: movie.imdbId,
      title: movie.title,
      rating: movie.rating,
      genres: movie.genres.map(genre => genre.name),
      cast: movie.cast.map(cast => cast),
      image: movie.imageSet.verticalPoster.w720,
      year: movie.releaseYear,
    };
    
    try {
      const response = await fetch('https://server-sandy-eta-92.vercel.app/api/user/watched', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        handleSnackbarOpen(`Error: ${errorData.error}`); 
        return;
      }
      const data = await response.json();
      removeFromWatchlist(movie.imdbId);
      handleSnackbarOpen('Movie added to watched'); 
    } catch (error) {
      console.error('Error while adding to watched:', error);
    }
  };

  const addToWatchlist = async (movie) => {
    const token = localStorage.getItem('token');
    
    const movieDetails = {
      id: movie.imdbId,
      title: movie.title,
      rating: movie.rating,
      genres: movie.genres.map(genre => genre.name),
      cast: movie.cast.map(cast => cast),
      image: movie.imageSet.verticalPoster.w720,
      year: movie.releaseYear,
    };
    
    try {
      const response = await fetch('https://server-sandy-eta-92.vercel.app/api/user/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        handleSnackbarOpen(`Error: ${errorData.error}`);
        return;
      }
      const data = await response.json();
      handleSnackbarOpen('Movie added to watchlist'); 
    } catch (error) {
      console.error('Error while adding to watchlist:', error);
    }
  };

  const handleSnackbarOpen = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  

  return (
    <>
    <Navbar />
    <div className="cards-body">
      <div className="above-text">
      <p className='cards-text'>Showing search results for "{text}" </p>
      </div>
      <div id="movie-card" className="container">
              {movies.map((movie) => (
                  <div className="card" key={movie.id} onClick={() => handleCardClick(movie.imdbId)} style={{ cursor: 'pointer' }}>
                      <img src={movie.imageSet.verticalPoster.w720} className="cardImage" alt={movie.title} />
                      <div className="cardDetails">
                        <div className="title-cards">
                          <Typography ><strong>{movie.title}</strong></Typography>
                        </div>
                        <div className="details-cards">
                          <p><strong>Release Year: </strong>{movie.releaseYear}</p>
                          <p><strong>Rating: </strong>{movie.rating / 10}</p>
                          <p><strong>Genres: </strong> {movie.genres.map(genre => genre.name).join(', ')}</p>
                        </div>
                        <div className="buttons-cards">
                        <Tooltip title="Add to Watchlist" arrow><IconButton sx={{color: 'white'}} aria-label='add to watchlist' onClick={(e) =>{ e.stopPropagation(); addToWatchlist(movie); }} ><AddToQueueIcon /></IconButton></Tooltip>
                        <Tooltip title="Add to Watched" arrow><IconButton sx={{color: 'white'}} aria-label='add to watched' onClick={(e) =>{ e.stopPropagation(); addToWatched(movie); }} ><QueueIcon /></IconButton></Tooltip>
                        </div>
                      </div>
                  </div>
              ))}
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
        open={snackbarOpen}
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} sx={{ 
      width: '100%', 
      backgroundColor: '#17a2b8', 
      color: 'white' 
    }} 
    variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </>
  )
}

export default MovieCards
