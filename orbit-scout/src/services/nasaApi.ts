import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { NEXT_PUBLIC_NASA_API_KEY } = process.env;

const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const API_KEY = NEXT_PUBLIC_NASA_API_KEY; // Replace with your NASA API key

interface NeoResponse {
  near_earth_objects: Record<string, NeoObject[]>;
}

interface NeoObject {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: {
    close_approach_date: string;
    relative_velocity: {
      kilometers_per_second: string;
    };
    miss_distance: {
      astronomical: string;
    };
  }[];
}

export const fetchNEOData = async (start_date: string, end_date: string): Promise<NeoResponse> => {
  const response = await axios.get<NeoResponse>(`${NASA_API_URL}?start_date=${start_date}&end_date=${end_date}&api_key=${API_KEY}`);
  return response.data;
};