import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Rating, Accordion, AccordionSummary, AccordionDetails, Typography, Button, CircularProgress, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Watch = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [url, setUrl] = useState("");
  const [selectedService, setSelectedService] = useState("vidsrc");

  const fetchMovie = async (id) => {
    const url = `https://streaming-availability.p.rapidapi.com/shows/${id}?series_granularity=episode&output_language=en`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_STREAMING_AVAILABILITY_API_KEY,
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
      },
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const movieData = await response.json();
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

  const truncateDescription = (description) => {
    const words = description.split(' ');
    if (words.length > 50) {
      return `${words.slice(0, 50).join(' ')}... more`;
    }
    return description;
  };

  useEffect(() => {
    if (id) {
      fetchMovie(id);
    }
  }, [id]);

  useEffect(() => {
    if (movie) {
      handleServiceClick('vidsrc');
    }
  }, [movie]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
    const baseUrls = {
      autoembed: {
        movie: `https://player.autoembed.cc/embed/movie/${id}`,
        series: `https://player.autoembed.cc/embed/tv/${id}/${selectedSeason}/${selectedEpisode}`,
      },
      vidsrc: {
        movie: `https://vidsrc.xyz/embed/movie?imdb=${id}&ds_lang=en`,
        series: `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${selectedSeason}&episode=${selectedEpisode}&ds_lang=en`,
      },
      movies111: {
        movie: `https://111movies.com/movie/${id}`,
        series: `https://111movies.com/tv/${id}/${selectedSeason}/${selectedEpisode}`,
      }
    };

    if (movie?.showType === 'series') {
      setUrl(baseUrls[service].series);
    } else {
      setUrl(baseUrls[service].movie);
    }
  };

  const handleEpisodeClick = (seasonIndex, episodeIndex) => {
    setSelectedSeason(seasonIndex + 1);
    setSelectedEpisode(episodeIndex + 1);

    const baseUrls = {
      autoembed: {
        movie: `https://player.autoembed.cc/embed/movie/${id}`,
        series: `https://player.autoembed.cc/embed/tv/${id}/${seasonIndex + 1}/${episodeIndex + 1}`,
      },
      vidsrc: {
        movie: `https://vidsrc.xyz/embed/movie?imdb=${id}&ds_lang=en`,
        series: `https://vidsrc.xyz/embed/tv?imdb=${id}&season=${seasonIndex + 1}&episode=${episodeIndex + 1}&ds_lang=en`,
      },
      movies111: {
        movie: `https://111movies.com/movie/${id}`,
        series: `https://111movies.com/tv/${id}/${seasonIndex + 1}/${episodeIndex + 1}`,
      }
    };

    if (movie?.showType === 'series') {
      setUrl(baseUrls[selectedService].series);
    } else {
      setUrl(baseUrls[selectedService].movie);
    }
  };

  // Highlight selected episode
  const isEpisodeSelected = (seasonIndex, episodeIndex) => {
    return selectedSeason === seasonIndex + 1 && selectedEpisode === episodeIndex + 1;
  };

  // Highlight selected service button
  const getServiceButtonClass = (service) => {
    return selectedService === service ? 'selected-service-button' : '';
  };

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
      <div className="movie-tab">
        <div className="movie-frame-out">
          <iframe
            src={url} 
            className="movie-frame"
            height="100%"
            width="90%"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Movie"
          ></iframe>
        </div>
        <div className="movie-details-frame">
          <div className="frame-img">
            <img src={movie.imageSet?.verticalPoster?.w720} alt="movie poster" />
          </div>

          <div className="text-details-frame">
            <div className="titleandbutton">
              <p className="frame-title">{movie.title}</p>
            </div>
            {movie.showType === 'series' ? (
              <p className="year detail">
                {movie.genres?.map(genre => genre.name).join(' | ')}&nbsp;&nbsp;&nbsp;&nbsp;{movie.seasonCount} {movie.seasonCount > 1 ? 'Seasons' : 'Season'}
              </p>
            ) : (
              <p className="year detail">
                {movie.releaseYear}&nbsp;&nbsp;&nbsp;&nbsp;{movie.genres?.map(genre => genre.name).join(' | ')}&nbsp;&nbsp;&nbsp;&nbsp;{convertRuntime(movie.runtime)}
              </p>
            )}
            <p className="genres detail"><strong>Cast: </strong>{movie.cast?.map(actor => actor).join(', ')}</p>
            <Rating name="half-rating-read" defaultValue={movie.rating / 100 * 5} precision={0.1} readOnly />
            <p className="description detail">{truncateDescription(movie.overview)}</p>
            <div className="buttons detail2">
              <Box sx={{ display: 'flex', gap: 1, padding: '0.5rem 0' }}>
              
                <Button
                  onClick={() => handleServiceClick('autoembed')}
                  variant="contained"
                  sx={{
                    borderRadius: '2rem',
                    margin: '1rem 0',
                    backgroundColor: '#17a2b8',
                    width: '150px',
                    height: '40px',
                    padding: '0',
                  }}
                  className={getServiceButtonClass('autoembed')}
                >
                  <img className="service-img" src="https://autoembed.cc/images/logo.png?v=0.6" alt="AutoEmbed" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                </Button>
                <Button
                  onClick={() => handleServiceClick('vidsrc')}
                  variant="contained"
                  sx={{
                    borderRadius: '2rem',
                    margin: '1rem 0',
                    backgroundColor: '#17a2b8',
                    width: '150px',
                    height: '40px',
                    padding: '0',
                  }}
                  className={getServiceButtonClass('vidsrc')}
                >
                  <img className="service-img" src="https://vidsrc.in/template/vidsrc-logo-light.svg" alt="Vidsrc" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                </Button>
                <Button
                  onClick={() => handleServiceClick('movies111')}
                  variant="contained"
                  sx={{
                    borderRadius: '2rem',
                    margin: '1rem 0',
                    backgroundColor: '#17a2b8',
                    width: '150px',
                    height: '40px',
                    padding: '0',
                  }}
                  className={getServiceButtonClass('movies111')}
                >
                  <img className="service-img" src="https://111movies.com/assets/img/logo.png" alt="111Movies" style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                </Button>
              </Box>
            </div>
          </div>
        </div>

        <div className="accordions">
          <div className="seasons-container">
            {movie.seasons && movie.seasons.map((season, index) => (
              <Accordion key={index} disableGutters>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  id={`season${index}`}
                  style={{ backgroundColor: '#17a2b8', color: 'white'}}
                >
                  <Typography>Season {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {season.episodes && season.episodes.map((episode, episodeIndex) => (
                    <Button
                      key={episodeIndex}
                      fullWidth
                      onClick={() => handleEpisodeClick(index, episodeIndex)}
                      style={{
                        textAlign: 'left',
                        backgroundColor: isEpisodeSelected(index, episodeIndex) ? '#19b8d0' : 'transparent',
                        color: isEpisodeSelected(index, episodeIndex) ? 'white' : 'black',
                      }}
                    >
                      {episode.title}
                    </Button>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Watch;
