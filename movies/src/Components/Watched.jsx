import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import QueueIcon from '@mui/icons-material/Queue';
import RemoveFromQueueIcon from '@mui/icons-material/RemoveFromQueue';
import Navbar from './Navbar';
import Tooltip from '@mui/material/Tooltip';

const Watched = () => {
    const [watched, setWatched] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchWatched = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/watched', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token in localStorage
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
            const response = await fetch(`http://localhost:5000/api/user/watched/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT token in localStorage
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove movie from watched');
            }

            // Update the watchlist locally after successful removal
            setWatched((prevWatched) => prevWatched.filter((movie) => movie.id !== movieId));
        } catch (error) {
            console.error('Error removing movie from watched:', error);
            setError('Failed to remove movie');
        }
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
        </>
    );
};

export default Watched;
