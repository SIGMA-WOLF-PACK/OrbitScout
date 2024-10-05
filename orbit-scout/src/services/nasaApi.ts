import { AxiosError } from 'axios';
import axios from 'axios';

const NASA_API_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY;

// Enhanced type definitions
export interface NeoResponse {
  links: {
    next: string;
    prev: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: Record<string, Neo[]>;
}

export interface Neo {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    orbital_period: string;
    perihelion_distance: string;
    aphelion_distance: string;
  };
}

// Error handling
export class NasaApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'NasaApiError';
  }
}

// Request throttling
const requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  isProcessingQueue = true;

  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
      // Wait 1 second between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  isProcessingQueue = false;
};

// Enhanced API client
export const fetchNEOData = async (startDate: string, endDate: string): Promise<NeoResponse> => {
  return new Promise((resolve, reject) => {
    const request = async () => {
      try {
        if (!API_KEY) {
          throw new NasaApiError('NASA API key is not configured');
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 7) {
          throw new NasaApiError('Date range cannot exceed 7 days');
        }

        if (daysDiff < 0) {
          throw new NasaApiError('End date must be after start date');
        }

        const response = await axios.get<NeoResponse>(NASA_API_URL, {
          params: {
            start_date: startDate,
            end_date: endDate,
            api_key: API_KEY,
            detailed: 'true' // Get additional orbital data when available
          },
          timeout: 10000 // 10 second timeout
        });

        resolve(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            reject(new NasaApiError(
              typeof axiosError?.response?.data === 'string' ? axiosError.response.data : 'NASA API request failed',
              axiosError.response.status,
              typeof axiosError.response.data === 'object' && axiosError.response.data !== null ? axiosError.response.data as Record<string, unknown> : undefined
            ));
          } else if (axiosError.request) {
            // The request was made but no response was received
            reject(new NasaApiError('No response received from NASA API'));
          } else {
            // Something happened in setting up the request
            reject(new NasaApiError(axiosError.message));
          }
        } else {
          reject(new NasaApiError('An unexpected error occurred'));
        }
      }
    };

    requestQueue.push(request);
    processQueue();
  });
};

// Helper function to get the size category of an NEO
export const getNEOSizeCategory = (neo: Neo): 'small' | 'medium' | 'large' => {
  const avgDiameter = (
    neo.estimated_diameter.kilometers.estimated_diameter_min +
    neo.estimated_diameter.kilometers.estimated_diameter_max
  ) / 2;

  if (avgDiameter < 0.1) return 'small';
  if (avgDiameter < 0.5) return 'medium';
  return 'large';
};

// Helper function to format distance for display
export const formatDistance = (distance: string, unit: 'astronomical' | 'kilometers' | 'lunar' = 'astronomical'): string => {
  const value = parseFloat(distance);
  switch (unit) {
    case 'astronomical':
      return `${value.toFixed(6)} AU`;
    case 'kilometers':
      return `${value.toLocaleString()} km`;
    case 'lunar':
      return `${value.toFixed(1)} LD`;
    default:
      return distance;
  }
};

// Helper function to format velocity for display
export const formatVelocity = (velocity: string): string => {
  return `${parseFloat(velocity).toFixed(2)} km/s`;
};