import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


const Main = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(searchText);
      console.log('User input:', searchText); // Perform action on Enter
      navigate('/movielist');
    }
  };


  return (
    <>
    
    <Navbar />
    <div className='main-body'>
        <SearchIcon className='icon' />
        <input placeholder='Search for Movies..'  className='main-input' value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={handleKeyDown} />
    </div>
    </>
  )

}

export default Main
