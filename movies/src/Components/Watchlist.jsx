import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import QueueIcon from '@mui/icons-material/Queue';
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue';
import Navbar from './Navbar';
import Tooltip from '@mui/material/Tooltip';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/watchlist', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token in localStorage
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json(); // Parse the JSON from the response
                setWatchlist(data.watchlist); // Assuming `data.watchlist` is the array
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
            const response = await fetch(`http://localhost:5000/api/user/watchlist/${movieId}`, {
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
          id: movie.id,
          title: movie.title,
          rating: movie.rating,
          genres: movie.genres.map(genre => genre),
          cast: movie.cast.map(cast => cast),
          image: movie.image,
        };
        
        try {
          const response = await fetch('http://localhost:5000/api/user/watched', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(movieDetails),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`); 
            return;
          }
          const data = await response.json();
          removeFromWatchlist(movie.id);
        } catch (error) {
          console.error('Error while adding to watched:', error);
        }
      };

    return (
        <>
        <Navbar />       
        <div className="cards-body">
            <div className="above-text">
                {watchlist.length == 0 ? 
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
                                    <IconButton sx={{ color: 'white' }} aria-label='add to watchlist' onClick={(e) => { e.stopPropagation(); removeFromWatchlist(movie.id); }}>
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
        </>
    );
};

export default Watchlist;
