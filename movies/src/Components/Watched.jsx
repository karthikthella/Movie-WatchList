import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue';
import Navbar from './Navbar';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const Watched = () => {
    const [watched, setWatched] = useState([]);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatched = async () => {
            try {
                const response = await fetch('https://server-sandy-eta-92.vercel.app/api/user/watched', {
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
                setWatched(data.watched); 
            } catch (error) {
                console.error('Error fetching watched:', error);
                setError(error.message);
            }
        };

        fetchWatched();
    }, []);

    const handleCardClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    

    const removeFromWatched = async (movieId) => {
        try {
            const response = await fetch(`https://server-sandy-eta-92.vercel.app/api/user/watched/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove movie from watched');
            }

         
            setWatched((prevWatched) => prevWatched.filter((movie) => movie.id !== movieId));
            handleSnackbarOpen('Movie removed from watched');
        } catch (error) {
            console.error('Error removing movie from watched:', error);
            setError('Failed to remove movie');
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
                {watched.length == 0 ? 
                <p className='cards-text'>Your watched list is empty</p>     
                :
                <p className='cards-text'>Showing your watched movies...</p>
                }
            </div>
            <div id="movie-card" className="container">
                {error ? (
                    <p>Error: {error}</p>
                ) : (
                    watched.map((movie) => (
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
                                <Tooltip title="Remove from Watched" arrow>
                                    <IconButton sx={{ color: 'white' }} aria-label='remove from watched' onClick={(e) => { e.stopPropagation(); removeFromWatched(movie.id); }}>
                                        <RemoveFromQueueIcon />
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

export default Watched;
