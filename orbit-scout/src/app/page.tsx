"use client";

import { useEffect, useState } from 'react';
import SolarSystem from '../components/SolarSystem';
import { fetchNEOData } from '../services/nasaApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Info, Rocket, Star, AlertCircle, Radio, Ruler, Calendar as CalendarIcon } from 'lucide-react';
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
  const [introDialogClosed, setIntroDialogClosed] = useState(false);

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

  const handleIntroDialogClose = () => {
    setShowIntroDialog(false);
    setIntroDialogClosed(true);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8 mb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center gap-4">
            <Rocket className="h-12 w-12 animate-bounce" />
            <div>
              <h1 className="text-4xl font-bold mb-2 font-comic">Orbit Scout!</h1>
              <p className="text-lg opacity-90">
                Join us on an amazing journey through space! 🚀✨
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5">
        {introDialogClosed && (
          <div className="mb-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6 text-yellow-300" />
              <div>
                <h2 className="text-xl font-semibold text-white">Our Space Adventure Timeline</h2>
                <p className="text-purple-200">
                  Exploring from {format(startDate, 'MMM dd, yyyy')} to {format(endDate, 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-300 animate-pulse" />
                <h2 className="text-2xl font-semibold text-white">Magic Space Window</h2>
              </div>
              <Button
                onClick={() => setShowDatePicker(true)}
                className="bg-purple-500 hover:bg-purple-600 transition-all duration-300 flex items-center gap-2"
              >
                <Radio className="h-4 w-4" /> Change Time Machine Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent" />
                  <p className="text-white text-lg">Scanning the cosmos... 🔭</p>
                </div>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
                <AlertCircle className="h-4 w-4 text-white" />
                <AlertDescription className="text-white">
                  Oops! Our space telescope needs fixing! {error}
                  <Button
                    onClick={() => fetchData(startDate, endDate)}
                    variant="outline"
                    className="ml-4 border-white text-white hover:bg-white/20"
                  >
                    Try Again
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <SolarSystem neoData={neoData} onNEOClick={handleNEOClick} />
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-300" />
                Space Rock Collection
              </h2>
              <p className="text-purple-200">
                We found {neoData.length} amazing space rocks! ⭐
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {neoData.map((neo) => (
                  <div
                    key={neo.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedNEO?.id === neo.id 
                        ? 'bg-purple-500/30 border-purple-400/50' 
                        : 'bg-white/5 border-white/10 hover:bg-white/20'
                    } border backdrop-blur-md`}
                    onClick={() => setSelectedNEO(neo)}
                  >
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Rocket className="h-4 w-4" />
                      {neo.name}
                    </h3>
                    <div className="text-sm text-purple-200 mt-2">
                      <p>Flies by on: {format(new Date(neo.close_approach_data[0]?.close_approach_date), 'MMM dd, yyyy')}</p>
                      <p>Size: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedNEO && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                    <Ruler className="h-6 w-6 text-yellow-300" />
                    Space Rock Details
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedNEO(null)}
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-purple-200">{selectedNEO.name}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">How Big?</p>
                      <p className="text-2xl font-medium">
                        {selectedNEO.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} km
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">How Far?</p>
                      <p className="text-2xl font-medium">
                        {parseFloat(selectedNEO.close_approach_data[0].miss_distance.astronomical).toFixed(2)} AU
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">How Fast?</p>
                      <p className="text-2xl font-medium">
                        {parseFloat(selectedNEO.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(2)} km/s
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">When?</p>
                      <p className="text-2xl font-medium">
                        {format(new Date(selectedNEO.close_approach_data[0].close_approach_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Date Range Dialog - Updated for child-friendly theme */}
        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500">
            <DialogHeader>
              <DialogTitle className="text-white">Set Your Time Machine! ⏰</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="mb-2 text-white">Start Date</h3>
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  className="rounded-md border-purple-500"
                />
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <h3 className="mb-2 text-white">End Date</h3>
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  className="rounded-md border-purple-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowDatePicker(false)} className="text-white border-white hover:bg-white/20">
                Cancel
              </Button>
              <Button onClick={handleDateRangeSubmit} className="bg-purple-500 hover:bg-purple-600">
                Start Adventure!
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Introduction Dialog - Updated for child-friendly theme */}
        <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
          <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white">
                <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
                Welcome Orbit Scouters! 🚀
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 text-white">
              <p className="text-lg">
                Get ready for an amazing space adventure! We're going to explore special rocks called Near-Earth Objects (NEOs) that float around in space near our planet! 
              </p>
              <div className="bg-white/10 p-6 rounded-xl">
                <h3 className="font-semibold mb-4 text-xl">Your Space Mission:</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-yellow-300" />
                    Look through our magic space window to see amazing asteroids
                  </li>
                  <li className="flex items-center gap-3">
                    <Rocket className="h-5 w-5 text-yellow-300" />
                    Click on space rocks to learn their secrets
                  </li>
                  <li className="flex items-center gap-3">
                    <CalendarIcon className="h-5 w-5 text-yellow-300" />
                    Use our time machine to explore different days
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleIntroDialogClose} className="bg-purple-500 hover:bg-purple-600">
                Start Your Space Journey! 🌟
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <footer className="mt-12 bg-purple-900/50 backdrop-blur-md text-white py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <p className="text-purple-200">
            Space data provided by our friends at NASA! 🛸
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;