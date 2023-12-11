
// pages/index.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('/api/api');
      setPokemonList(response.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id}>{pokemon.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
