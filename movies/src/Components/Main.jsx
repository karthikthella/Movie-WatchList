import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';



const Main = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const handleClickText = () => navigate("/ai-suggestions");
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchText);
      console.log('User input:', searchText); 
      navigate('/movielist');
    }
  };


  return (
    <>
    
    <Navbar />
    <div className='main-body'>
        <SearchIcon className='icon' />
        <input placeholder='Search for Movies..'  className='main-input' value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={handleKeyDown} />
        <div className="movie-sugg-text">
         <a onClick={handleClickText}>Not sure what to watch? Ask Gemini.</a>
        </div>
    </div>
    </>
  )

}

export default Main
