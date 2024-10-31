import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import QueueIcon from '@mui/icons-material/Queue';
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue';
import Navbar from './Navbar';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await fetch('https://server-sandy-eta-92.vercel.app/api/user/watchlist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); 
        setWatchlist(data.watchlist); 
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError(error.message);
      }
    };

    fetchWatchlist();
  }, []);

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await fetch(`https://server-sandy-eta-92.vercel.app/api/user/watchlist/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove movie from watchlist');
      }

      setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== movieId));
      handleSnackbarOpen('Movie removed from watchlist');
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
      setError('Failed to remove movie');
    }
  };

  const addToWatched = async (movie) => {
    const token = localStorage.getItem('token');
    const movieDetails = {
      id: movie.id,
      title: movie.title,
      rating: movie.rating,
      genres: movie.genres.map(genre => genre),
      cast: movie.cast.map(cast => cast),
      image: movie.image,
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
      removeFromWatchlist(movie.id);
      handleSnackbarOpen('Movie added to watched'); 
    } catch (error) {
      console.error('Error while adding to watched:', error);
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
          {watchlist.length === 0 ? 
            <p className='cards-text'>Your watchlist is empty</p>     
            :
            <p className='cards-text'>Showing your watchlist...</p>
          }
        </div>
        <div id="movie-card" className="container">
          {error ? (
            <p>Error: {error}</p>
          ) : (
            watchlist.map((movie) => (
              <div className="card" key={movie.id} onClick={() => handleCardClick(movie.id)} style={{ cursor: 'pointer' }}>
                <img src={movie.image} className="cardImage" alt={movie.title} />
                <div className="cardDetails">
                  <div className="title-cards">
                    <Typography><strong>{movie.title}</strong></Typography>
                  </div>
                  <div className="details-cards">
                    <p><strong>Release Year: </strong>{movie.year}</p>
                    <p><strong>Rating: </strong>{movie.rating / 10}</p>
                    <p><strong>Genres: </strong> {movie.genres.join(', ')}</p>
                  </div>
                  <div className="buttons-cards">
                    <Tooltip title="Remove from Watchlist" arrow>
                      <IconButton sx={{ color: 'white' }} aria-label='remove from watchlist' onClick={(e) => { e.stopPropagation(); removeFromWatchlist(movie.id); }}>
                        <RemoveFromQueueIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Add to Watched" arrow>
                      <IconButton sx={{ color: 'white' }} aria-label='add to watched' onClick={(e) => { e.stopPropagation(); addToWatched(movie); }}>
                        <QueueIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
        open={snackbarOpen}
        autoHideDuration={5000} 
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ 
      width: '100%', 
      backgroundColor: '#17a2b8', 
      color: 'white' 
    }} >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Watchlist;
