import axios from 'axios';

const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

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

export const fetchNEOData = async (startDate: string, endDate: string): Promise<NeoResponse> => {
  try {
    const response = await axios.get<NeoResponse>(NASA_API_URL, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    throw new Error('Failed to fetch NEO data');
  }
};