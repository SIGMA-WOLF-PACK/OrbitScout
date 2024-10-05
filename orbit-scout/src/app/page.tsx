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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNEOData = async () => {
      const startDate = '2024-10-01';
      const endDate = '2024-10-05';

      try {
        const data = await fetchNEOData(startDate, endDate);
        const neoObjects = Object.values(data.near_earth_objects).flat();
        setNeoData(neoObjects);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error('Error fetching NEO data:', error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    getNEOData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <Head>
        <title>Orbit Scout</title>
      </Head>
      <main className="max-w-4xl w-full p-5">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-5">Welcome to the OrbitScout</h1>
        <SolarSystem />
        <h2 className="text-2xl font-semibold text-gray-800 text-center mt-5">Near-Earth Objects</h2>
        {error ? (
          <p className="text-red-500 text-center font-semibold mt-4">Error: {error}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {neoData.map((neo) => (
              <li key={neo.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
                {neo.name} (Approach Date: {neo.close_approach_data[0]?.close_approach_date})
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Home;
