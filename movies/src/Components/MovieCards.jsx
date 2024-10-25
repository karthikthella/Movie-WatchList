import { Typography, IconButton } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import QueueIcon from '@mui/icons-material/Queue';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import Tooltip from '@mui/material/Tooltip';
import Navbar from './Navbar';

const MovieCards = ({ text, movies }) => {
  const navigate = useNavigate();

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };
  console.log(movies);

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
      id: movie.imdbId,
      title: movie.title,
      rating: movie.rating,
      genres: movie.genres.map(genre => genre.name),
      cast: movie.cast.map(cast => cast),
      image: movie.imageSet.verticalPoster.w720,
      year: movie.releaseYear,
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
      alert(data.message);
      removeFromWatchlist(movie.imdbId);
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
      const response = await fetch('http://localhost:5000/api/user/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieDetails),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`); // Show error message
        return;
      }
      const data = await response.json();
      alert(data.message); // Show success message
    } catch (error) {
      console.error('Error while adding to watchlist:', error);
    }
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
      </>
  )
}

export default MovieCards
