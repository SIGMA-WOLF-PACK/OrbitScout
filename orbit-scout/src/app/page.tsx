"use client";

import { useEffect, useState } from 'react';
import SolarSystem from '../components/SolarSystem';
import { fetchNEOData } from '../services/nasaApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Rocket, Star, AlertCircle, Radio, Ruler, Calendar as CalendarIcon, MessageCircle, ThumbsUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/navbar';
import Image from 'next/image';

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
  is_potentially_hazardous_asteroid: boolean;
}

interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  replies: number;
  timestamp: string;
  relatedNeoId?: string;
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

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      author: 'SpaceExplorer123',
      avatar: '/api/placeholder/32/32',
      content: 'Just spotted this amazing asteroid! It\'s moving so fast! 🚀',
      likes: 5,
      replies: 2,
      timestamp: '5m ago',
      relatedNeoId: '2000433'
    },
    {
      id: '2',
      author: 'StarGazer',
      avatar: '/api/placeholder/32/32',
      content: 'Did anyone else notice how close this one is passing by? Super interesting! ⭐',
      likes: 3,
      replies: 1,
      timestamp: '15m ago',
      relatedNeoId: '2001036'
    }
  ]);

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

  const svgIcon = (
    <svg width="20" height="20" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_33_2)">
        <path d="M1928.52 3.51562L1169.53 295.312L1178.52 180.859C1182.42 130.859 1128.52 96.875 1084.77 121.875L395.703 521.094C150.781 662.891 0 924.219 0 1207.03C0 1644.92 355.078 2000 792.969 2000C1075.78 2000 1337.5 1849.22 1479.3 1604.3L1878.12 915.234C1903.52 871.875 1869.53 817.578 1819.14 821.484L1704.69 830.469L1996.48 71.4844C1998.83 65.625 2000 58.9844 2000 52.7344C2000 23.4375 1976.56 0 1947.27 0C1940.62 0 1934.38 1.17187 1928.52 3.51562ZM750 750C882.608 750 1009.79 802.678 1103.55 896.447C1197.32 990.215 1250 1117.39 1250 1250C1250 1382.61 1197.32 1509.79 1103.55 1603.55C1009.79 1697.32 882.608 1750 750 1750C617.392 1750 490.215 1697.32 396.447 1603.55C302.678 1509.79 250 1382.61 250 1250C250 1117.39 302.678 990.215 396.447 896.447C490.215 802.678 617.392 750 750 750ZM750 1125C750 1091.85 736.83 1060.05 713.388 1036.61C689.946 1013.17 658.152 1000 625 1000C591.848 1000 560.054 1013.17 536.612 1036.61C513.17 1060.05 500 1091.85 500 1125C500 1158.15 513.17 1189.95 536.612 1213.39C560.054 1236.83 591.848 1250 625 1250C658.152 1250 689.946 1236.83 713.388 1213.39C736.83 1189.95 750 1158.15 750 1125ZM812.5 1500C829.076 1500 844.973 1493.42 856.694 1481.69C868.415 1469.97 875 1454.08 875 1437.5C875 1420.92 868.415 1405.03 856.694 1393.31C844.973 1381.58 829.076 1375 812.5 1375C795.924 1375 780.027 1381.58 768.306 1393.31C756.585 1405.03 750 1420.92 750 1437.5C750 1454.08 756.585 1469.97 768.306 1481.69C780.027 1493.42 795.924 1500 812.5 1500Z" fill="white"/>
      </g>
      <defs>
        <clipPath id="clip0_33_2">
          <rect width="2000" height="2000" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );

  const handlePostSubmit = (content: string, relatedNeoId?: string) => {
    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '/api/placeholder/32/32',
      content,
      likes: 0,
      replies: 0,
      timestamp: 'Just now',
      relatedNeoId
    };
    setForumPosts([newPost, ...forumPosts]);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 min-h-screen">
      <Navbar/>

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
                      {svgIcon}
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
                  <div>
                    <div className={`p-4 rounded-xl border ${selectedNEO.is_potentially_hazardous_asteroid ? 'border-red-500 bg-red-500/20' : 'border-green-500 bg-green-500/20'}`}>
                      <p className="text-purple-200">Danger Level:</p>
                      <p className={`text-2xl font-medium ${selectedNEO.is_potentially_hazardous_asteroid ? 'text-red-500' : 'text-green-500'}`}>
                        {selectedNEO.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not Hazardous'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* New Forum Section */}
        <div className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-yellow-300" />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">Space Explorers Chat</h2>
                    <p className="text-purple-200">Share your discoveries with fellow space adventurers! 🚀</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <Textarea 
                    placeholder="Share your space thoughts..." 
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 mb-4"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-purple-200 text-sm">
                      {selectedNEO ? `Talking about: ${selectedNEO.name}` : 'General space chat'}
                    </p>
                    <Button 
                      onClick={() => handlePostSubmit("Your message here", selectedNEO?.id)}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      Share Discovery! 🌟
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {forumPosts.map(post => (
                    <div 
                      key={post.id}
                      className="bg-white/5 p-4 rounded-xl border border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={post.avatar} alt={post.author} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">{post.author}</h3>
                            <span className="text-purple-200 text-sm">
                              {post.timestamp}
                            </span>
                          </div>
                          <p className="text-purple-200 mb-4">{post.content}</p>
                          {post.relatedNeoId && (
                            <div className="bg-purple-500/20 px-3 py-1 rounded-full text-sm text-white inline-block mb-4">
                              🔭 Looking at: {
                                neoData.find(neo => neo.id === post.relatedNeoId)?.name || 'Unknown NEO'
                              }
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" className="text-white hover:bg-white/10">
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button variant="ghost" className="text-white hover:bg-white/10">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {post.replies}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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