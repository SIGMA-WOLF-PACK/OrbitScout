// "use client";

// import { useEffect, useState } from 'react';
// import SolarSystem from '../components/SolarSystem';
// import { fetchNEOData } from '../services/nasaApi';
// import Head from 'next/head';

// interface NeoObject {
//   id: string;
//   name: string;
//   close_approach_data: {
//     close_approach_date: string;
//   }[];
// }

// const Home: React.FC = () => {
//   const [neoData, setNeoData] = useState<NeoObject[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const getNEOData = async () => {
//       const startDate = '2024-10-01';
//       const endDate = '2024-10-05';

//       try {
//         const data = await fetchNEOData(startDate, endDate);
//         const neoObjects = Object.values(data.near_earth_objects).flat();
//         setNeoData(neoObjects);
//       } catch (error) {
//         if (error instanceof Error) {
//           setError(error.message);
//           console.error('Error fetching NEO data:', error.message);
//         } else {
//           setError('An unknown error occurred');
//         }
//       }
//     };

//     getNEOData();
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col items-center">
//       <Head>
//         <title>Orbit Scout</title>
//       </Head>
//       <main className="max-w-4xl w-full p-5">
//         <h1 className="text-4xl font-bold text-blue-600 text-center mb-5">Welcome to the OrbitScout</h1>
//         <SolarSystem />
//         <h2 className="text-2xl font-semibold text-gray-800 text-center mt-5">Near-Earth Objects</h2>
//         {error ? (
//           <p className="text-red-500 text-center font-semibold mt-4">Error: {error}</p>
//         ) : (
//           <ul className="mt-4 space-y-4">
//             {neoData.map((neo) => (
//               <li key={neo.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-200">
//                 {neo.name} (Approach Date: {neo.close_approach_data[0]?.close_approach_date})
//               </li>
//             ))}
//           </ul>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;

"use client";

import { useEffect, useState } from 'react';
import SolarSystem from '../components/SolarSystem';
import { fetchNEOData } from '../services/nasaApi';
import { Dialog } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface NEO {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: Array<{
    miss_distance: {
      astronomical: string;
    };
    relative_velocity: {
      kilometers_per_second: string;
    };
    close_approach_date: string;
  }>;
}

const Home: React.FC = () => {
  const [neoData, setNeoData] = useState<NEO[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNEO, setSelectedNEO] = useState<NEO | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date('2024-10-01'));
  const [endDate, setEndDate] = useState<Date>(new Date('2024-10-05'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIntroDialog, setShowIntroDialog] = useState(true);

  const fetchData = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const data = await fetchNEOData(
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd')
      );
      const neoObjects = Object.values(data.near_earth_objects).flat();
      setNeoData(neoObjects);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, [startDate, endDate]);

  const handleNEOClick = (neo: NEO) => {
    setSelectedNEO(neo);
  };

  const handleDateRangeSubmit = () => {
    setShowDatePicker(false);
    fetchData(startDate, endDate);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white py-6 mb-8">
        <div className="max-w-7xl mx-auto px-5">
          <h1 className="text-4xl font-bold mb-4">OrbitScout</h1>
          <p className="text-lg opacity-90">
            Explore Near-Earth Objects in our solar system
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Solar System Visualization</h2>
              <Button
                onClick={() => setShowDatePicker(true)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Change Date Range
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                  <p className="text-gray-600">Loading NEO data...</p>
                </div>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                  <Button
                    onClick={() => fetchData(startDate, endDate)}
                    variant="outline"
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <SolarSystem neoData={neoData} onNEOClick={handleNEOClick} />
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">NEO List</h2>
              <p className="text-gray-600">
                Showing {neoData.length} objects from {format(startDate, 'MMM dd, yyyy')} to {format(endDate, 'MMM dd, yyyy')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {neoData.map((neo) => (
                  <div
                    key={neo.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedNEO?.id === neo.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedNEO(neo)}
                  >
                    <h3 className="font-semibold">{neo.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>Approach: {format(new Date(neo.close_approach_data[0]?.close_approach_date), 'MMM dd, yyyy')}</p>
                      <p>Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedNEO && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">NEO Details</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedNEO(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{selectedNEO.name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Diameter</p>
                        <p className="font-medium">
                          {selectedNEO.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {selectedNEO.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Miss Distance</p>
                        <p className="font-medium">
                          {parseFloat(selectedNEO.close_approach_data[0].miss_distance.astronomical).toFixed(6)} AU
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Relative Velocity</p>
                        <p className="font-medium">
                          {parseFloat(selectedNEO.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)} km/s
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Close Approach Date</p>
                        <p className="font-medium">
                          {format(new Date(selectedNEO.close_approach_data[0].close_approach_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Date Range Dialog */}
        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-2">Start Date</h3>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <h3 className="mb-2">End Date</h3>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDatePicker(false)}>
                  Cancel
                </Button>
                <Button onClick={handleDateRangeSubmit}>
                  Apply Date Range
                </Button>
              </div>
            </div>
          </div>
        </Dialog>

        {/* Introduction Dialog */}
        <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">Welcome to OrbitScout</h2>
              </div>
              <div className="space-y-4">
                <p>
                  OrbitScout helps you explore Near-Earth Objects (NEOs) - asteroids and comets that orbit the Sun and come within 1.3 astronomical units of Earth.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">How to use OrbitScout:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>View the 3D visualization of our solar system and NEOs</li>
                    <li>Click on any NEO to see detailed information</li>
                    <li>Use the date range picker to explore different time periods</li>
                    <li>Browse the list of NEOs and their key characteristics</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowIntroDialog(false)}>
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </main>

      <footer className="mt-12 bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <p className="text-gray-400">
            Data provided by NASA Near Earth Object Web Service
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;