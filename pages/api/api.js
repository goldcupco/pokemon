// pages/api/api.js
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Step 1: Fetch Pokémon data from the PokéAPI and serve reduced data
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
    const pokemonData = response.data.results;

    const reducedData = await Promise.all(
      pokemonData.map(async (pokemon) => {
        const details = await axios.get(pokemon.url);
        return {
          name: pokemon.name,
          id: details.data.id,
          stats: details.data.stats,
          types: details.data.types,
          sprite: `/sprites/${details.data.id}.png`,
        };
      })
    );

    // Step 3: Store Pokémon data in a local SQLite database using Prisma
    // (Assuming you've already run `npx prisma generate` after updating the schema)
    // Uncomment the following lines if you have a local database
     await Promise.all(
       reducedData.map(async (pokemon) => {
         await prisma.pokemon.create({
           data: {
             name: pokemon.name,
             id: pokemon.id,
             stats: pokemon.stats,
             types: pokemon.types,
             sprite: pokemon.sprite,
           },
         });
       })
     );

    res.status(200).json(reducedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
