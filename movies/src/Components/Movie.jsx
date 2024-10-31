import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Button, Rating, Box, IconButton } from '@mui/material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import Navbar from './Navbar';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Movie = () => {
  const [movie, setMovie] = useState(null);
  const { id } = useParams();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchMovie = async (id) => {
    const url = `https://streaming-availability.p.rapidapi.com/shows/${id}?series_granularity=episode&output_language=en`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '66cb15bb2fmsh19b35ad58b7f7e5p1a045bjsnf19c174d6efb',
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const movieData = await response.json();
        console.log(movieData);
        setMovie(movieData);
      } else {
        console.log('Failed to fetch movie details');
      }
    } catch (error) {
      console.log('Error fetching movie:', error);
    }
  };

  const convertRuntime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = Math.round((totalMinutes % 1) * 60); 
  
    return `${hours}h ${minutes}m ${seconds}s`;
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

  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 50) {
      return `${words.slice(0, 50).join(' ')}... more`;
    }
    return description;
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

  useEffect(() => {
    if (id) {
      fetchMovie(id);
    }
  }, []);

  if (!movie) {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    );
  }
  

  return (
    <>
    <Navbar />
    <div className='movie-body-1'>
      <div className="poster-sec" style={{ backgroundImage: `url(${movie.imageSet?.horizontalBackdrop?.w1440})` }}>
        <div className="fade"></div>
        <div className="movie-details" style={{ zIndex: 2 }}>
          <div className="titleandbutton"><p className="title detail">{movie.title}</p></div>
          <p className="year detail">{movie.releaseYear}&nbsp;&nbsp;&nbsp;&nbsp;{movie.genres?.map(genre => genre.name).join(' | ')}&nbsp;&nbsp;&nbsp;&nbsp;{convertRuntime(movie.runtime)}</p>
          <p className='genres detail'><strong>Cast: </strong>{movie.cast?.map(actor => actor).join(', ')}</p>
          <Rating name="half-rating-read" defaultValue={movie.rating/100 * 5} precision={0.1} readOnly />
          <p className="description detail">{truncateDescription(movie.overview)}</p>
          <div className="buttons detail2">
            <p>Watch Now</p>
            <Box sx={{ display: 'flex', gap: 1, padding: '0.5rem 0'}}>
              {movie.streamingOptions?.in?.map((option, index) => (
                <Button key={index} href={option.link} className='button' target="_blank" variant='contained' sx={{ borderRadius: '2rem', margin: '1rem 0', backgroundColor: '#17a2b8'}}>
                  {option.service.name}
                </Button>
              ))}
            </Box>  
            <Tooltip title="Add to Watchlist" arrow><Button className='button-watch' sx={{color: 'white', backgroundColor: '#17a2b8', borderRadius: '2rem'}} aria-label='add to watchlist' onClick={(e) =>{ e.stopPropagation(); addToWatchlist(movie); }} startIcon={<AddToQueueIcon/>}>Add to Watchlist</Button></Tooltip>
          </div>

        </div>



      </div>
      
    </div>


    <div className="movie-body-2">

      <div className="movie-card">
      <img src={movie.imageSet?.horizontalBackdrop?.w1440} className="cardImage-movie" alt={movie.title} />
      </div>
      <div className="movie-details-1">
          <p className="title1 detail-min">{movie.title}</p>
          <p className="year detail-min">{movie.releaseYear}&nbsp;&nbsp;&nbsp;&nbsp;{movie.genres?.map(genre => genre.name).join(' | ')}&nbsp;&nbsp;&nbsp;&nbsp;{convertRuntime(movie.runtime)}</p>
          <p className='genres detail-min'><strong>Cast: </strong>{movie.cast?.map(actor => actor).join(', ')}</p>
          <Rating name="half-rating-read" defaultValue={movie.rating/100 * 5} precision={0.1} readOnly />
          <p className="description detail">{truncateDescription(movie.overview)}</p>
          <div className="buttons detail2">
            <p>Watch Now</p>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, padding: '0.3rem' }}>
              {movie.streamingOptions?.in?.map((option, index) => (
                <Button key={index} href={option.link} className='button' target="_blank" variant='contained' sx={{ borderRadius: '2rem', margin: '1rem 0', backgroundColor: '#17a2b8'}}>
                  {option.service.name}
                </Button>
              ))}
            </Box>  
          </div>
          <Tooltip title="Add to Watchlist" arrow><Button className='button-watch' sx={{color: 'white', backgroundColor: '#17a2b8', borderRadius: '2rem'}} aria-label='add to watchlist' onClick={(e) =>{ e.stopPropagation(); addToWatchlist(movie); }} startIcon={<AddToQueueIcon/>}>Add to Watchlist</Button></Tooltip>
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

export default Movie;
