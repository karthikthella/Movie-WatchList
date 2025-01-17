
import { useState, useEffect } from 'react'
import Main from './Components/Main'
import MovieCards from './Components/MovieCards';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Movie from './Components/Movie';
import Signin from './Components/Signin';
import Signup from './Components/Signup';
import Watchlist from './Components/Watchlist';
import Watched from './Components/Watched';
import AiSuggestion from './Components/AiSuggestion';
import Watch from './Components/Watch';

function App() {

  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [movies, setMovies] = useState([]);

  const fetchMovies = async (value) => {
    console.log("Searching for:", value);
    const url = 'https://streaming-availability.p.rapidapi.com/shows/search/title?country=in&title='+value;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': import.meta.env.VITE_STREAMING_AVAILABILITY_API_KEY,
		    'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
      },
    };

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const movieData = await response.json();
        console.log(movieData);
        setMovies(movieData);
      } else {
        console.error("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };


  useEffect(() => {
    if (input) {
      fetchMovies(input);
    }
  }, [input]);

  const handleSearch = (value) => {
    setInput(value);
    setSubmitted(true);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main onSearch={ handleSearch }/>} />
        <Route path='/movielist' element={<MovieCards text={ input } movies={ movies }/>} />
        <Route path='/movie/:id' element={<Movie />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/watchlist' element={<Watchlist />} />
        <Route path='/ai-suggestions' element={<AiSuggestion />} />
        <Route path='/watched' element={<Watched />} />
        <Route path='/watch/:id' element={<Watch />} />
       
      </Routes>
    </BrowserRouter>
  )
}

export default App
