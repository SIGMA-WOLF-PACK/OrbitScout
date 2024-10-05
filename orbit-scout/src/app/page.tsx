"use client";

import { useEffect, useState } from 'react';
import SolarSystem from '../components/SolarSystem';
import { fetchNEOData } from '../services/nasaApi';
import Head from 'next/head';

interface NeoObject {
  id: string;
  name: string;
  close_approach_data: {
    close_approach_date: string;
  }[];
}

const Home: React.FC = () => {
  const [neoData, setNeoData] = useState<NeoObject[]>([]);

  useEffect(() => {
    const getNEOData = async () => {
      const data = await fetchNEOData();
      const neoObjects = Object.values(data.near_earth_objects).flat();
      setNeoData(neoObjects);
    };
    getNEOData();
  }, []);

  return (
    <div>
      <Head>
        <title>Orrery Web App</title>
      </Head>
      <main>
        <h1>Welcome to the Orrery Web App</h1>
        <SolarSystem />
        <h2>Near-Earth Objects</h2>
        <ul>
          {neoData.map((neo) => (
            <li key={neo.id}>
              {neo.name} (Approach Date: {neo.close_approach_data[0]?.close_approach_date})
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;
