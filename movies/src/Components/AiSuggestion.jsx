import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import Navbar from './Navbar';

const AiSuggestion = () => {
  const [filters, setFilters] = useState({
    genre: '',
    actor: '',
    year: ''
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const generateContent = async () => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GENAIAPI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
  


    const { genre, actor, year } = filters;
    let prompt = `List ${genre || "all"} movies`;
    if (actor) prompt += ` starring ${actor}`;
    if (year) prompt += ` released after ${year}`;

    prompt += `. Provide the output as a list separated by newlines. Each line must strictly follow the format: 'Movie Name (YYYY)'. Do not include any headers, numbering, or introductory text.`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text(); 
      setResult(text);
    } catch (error) {
      console.error("Error generating content:", error);
      setResult("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  const renderMovies = (moviesText) => {
    if (moviesText == null) {
      return (
        <div className="no-results">
          <p>No results</p>
        </div>
      );
    }

    if (moviesText.includes("has not starred in any")) {
      return (
        <div className="no-results">
          <p>{moviesText}</p>
        </div>
      );
    }

    const movies = moviesText.split('\n');
    return movies.map((movie1, index) => {
      const movie = movie1.replace(/^[\d\*\-]+\.\s*/, '');
      const [movieName, year] = movie.split('(');
      const cleanedYear = year ? year.replace(')', '').trim() : null;
      console.log(cleanedYear);
      if (cleanedYear) {
        return (
          <div key={index}>
            <div className='movie-sugg'>
              <a onClick={() => handleMovieClick(movieName.trim(), cleanedYear)}>
                {movieName.trim().replace('*', '').replace('-', '')} ({cleanedYear})
              </a>
            </div>
            <div className="divider"></div>
          </div>
        );
      }
      return null;
    });
  };

  const handleMovieClick = async (movieName, year) => {
    const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&y=${year}&apikey=${import.meta.env.VITE_OMDBAPI_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === 'True') {
        const imdbId = data.imdbID;
        navigate(`/movie/${imdbId}`);
      } else {
        console.error('Movie not found:', data.Error);
      }
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='filter-body'>
        <div className="filter-field">
          <input
            className="filter-input"
            type="text"
            name="genre"
            placeholder="Enter genre"
            value={filters.genre}
            onChange={handleInputChange}
          />
          <input
            className="filter-input"
            type="text"
            name="actor"
            placeholder="Enter actor/actress"
            value={filters.actor}
            onChange={handleInputChange}
          />
          <input
            className="filter-input"
            name="year"
            placeholder="Enter year (e.g., 2020)"
            value={filters.year}
            onChange={handleInputChange}
          />
        </div>
        <button className='filter-button' onClick={generateContent}>Generate</button>
        {loading && (
          <div className="loading">
            <CircularProgress />
          </div>
        )}

        {!loading && result && (
          <div className="movie-sugg-container">
            <div>{renderMovies(result)}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default AiSuggestion;
