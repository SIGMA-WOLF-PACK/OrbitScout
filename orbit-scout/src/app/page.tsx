"use client";

import { useEffect, useState } from "react";
import SolarSystem from "../components/SolarSystem";
import { fetchNEOData } from "../services/nasaApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Rocket,
  Star,
  AlertCircle,
  Radio,
  Ruler,
  Calendar as CalendarIcon,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";

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
  const [startDate, setStartDate] = useState<Date>(new Date("2024-10-01"));
  const [endDate, setEndDate] = useState<Date>(new Date("2024-10-05"));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showIntroDialog, setShowIntroDialog] = useState(true);
  const [introDialogClosed, setIntroDialogClosed] = useState(false);

  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: "1",
      author: "SpaceExplorer123",
      avatar: "/api/placeholder/32/32",
      content: "Just spotted this amazing asteroid! It's moving so fast! 🚀",
      likes: 5,
      replies: 2,
      timestamp: "5m ago",
      relatedNeoId: "2000433",
    },
    {
      id: "2",
      author: "StarGazer",
      avatar: "/api/placeholder/32/32",
      content:
        "Did anyone else notice how close this one is passing by? Super interesting! ⭐",
      likes: 3,
      replies: 1,
      timestamp: "15m ago",
      relatedNeoId: "2001036",
    },
  ]);

  const fetchData = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const data = await fetchNEOData(
        format(start, "yyyy-MM-dd"),
        format(end, "yyyy-MM-dd")
      );
      const neoObjects = Object.values(data.near_earth_objects).flat();
      setNeoData(neoObjects);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

  const handlePostSubmit = (content: string, relatedNeoId?: string) => {
    const newPost: ForumPost = {
      id: Date.now().toString(),
      author: "You",
      avatar: "/api/placeholder/32/32",
      content,
      likes: 0,
      replies: 0,
      timestamp: "Just now",
      relatedNeoId,
    };
    setForumPosts([newPost, ...forumPosts]);
  };

  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {introDialogClosed && (
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-6 w-6 text-yellow-300" />
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">
                  Our Space Adventure Timeline
                </h2>
                <p className="text-sm sm:text-base text-purple-200">
                  Exploring from {format(startDate, "MMM dd, yyyy")} to{" "}
                  {format(endDate, "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>
        )}

        <Card className="mb-6 sm:mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-300 animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-semibold text-white">
                  Magic Space Window
                </h2>
              </div>
              <Button
                onClick={() => setShowDatePicker(true)}
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 transition-all duration-300 flex items-center gap-2"
              >
                <Radio className="h-4 w-4" /> Change Time Machine Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent" />
                  <p className="text-white text-lg">
                    Scanning the cosmos... 🔭
                  </p>
                </div>
              </div>
            ) : error ? (
              <Alert
                variant="destructive"
                className="bg-red-500/20 border-red-500/50"
              >
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
              <div
                style={{
                  width: "100vw",
                  height: "100vh",
                  position: "relative",
                }}
              >
                <SolarSystem
                  neoData={[]}
                  onNEOClick={(neo) => console.log("NEO clicked:", neo)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-300" />
                Space Rock Collection
              </h2>
              <p className="text-sm sm:text-base text-purple-200">
                We found {neoData.length} amazing space rocks! ⭐
              </p>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {neoData.map((neo) => (
                  // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                  <div
                    key={neo.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedNEO?.id === neo.id
                        ? "bg-purple-500/30 border-purple-400/50"
                        : "bg-white/5 border-white/10 hover:bg-white/20"
                    } border backdrop-blur-md`}
                    onClick={() => setSelectedNEO(neo)}
                  >
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-300" />
                      {neo.name}
                    </h3>
                    <div className="text-sm text-purple-200 mt-2">
                      <p>
                        Flies by on:{" "}
                        {format(
                          new Date(
                            neo.close_approach_data[0]?.close_approach_date
                          ),
                          "MMM dd, yyyy"
                        )}
                      </p>
                      <p>
                        Size:{" "}
                        {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                          2
                        )}{" "}
                        -{" "}
                        {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
                          2
                        )}{" "}
                        km
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedNEO && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-3">
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
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-purple-200">
                    {selectedNEO.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">How Big?</p>
                      <p className="text-xl sm:text-2xl font-medium text-white">
                        {selectedNEO.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
                          2
                        )}{" "}
                        km
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">How Far?</p>
                      <p className="text-xl sm:text-2xl font-medium text-white">
                        {Number.parseFloat(
                          selectedNEO.close_approach_data[0].miss_distance
                            .astronomical
                        ).toFixed(2)}{" "}
                        AU
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">How Fast?</p>
                      <p className="text-xl sm:text-2xl font-medium text-white">
                        {Number.parseFloat(
                          selectedNEO.close_approach_data[0].relative_velocity
                            .kilometers_per_second
                        ).toFixed(2)}{" "}
                        km/s
                      </p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="text-purple-200">When?</p>
                      <p className="text-xl sm:text-2xl font-medium text-white">
                        {format(
                          new Date(
                            selectedNEO.close_approach_data[0].close_approach_date
                          ),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div
                      className={`p-4 rounded-xl border ${
                        selectedNEO.is_potentially_hazardous_asteroid
                          ? "border-red-500 bg-red-500/20"
                          : "border-green-500 bg-green-500/20"
                      }`}
                    >
                      <p className="text-purple-200">Danger Level:</p>
                      <p
                        className={`text-xl sm:text-2xl font-medium ${
                          selectedNEO.is_potentially_hazardous_asteroid
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {selectedNEO.is_potentially_hazardous_asteroid
                          ? "Hazardous"
                          : "Not Hazardous"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mb-6 sm:mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-yellow-300" />
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">
                      Space Explorers Chat
                    </h2>
                    <p className="text-sm sm:text-base text-purple-200">
                      Share your discoveries with fellow space adventurers! 🚀
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <Textarea
                    placeholder="Share your space thoughts..."
                    className="bg-white/5 border-white/20 text-white placeholder:text-white/50 mb-4 min-h-[100px]"
                  />
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <p className="text-purple-200 text-sm">
                      {selectedNEO
                        ? `Talking about: ${selectedNEO.name}`
                        : "General space chat"}
                    </p>
                    <Button
                      onClick={() =>
                        handlePostSubmit("Your message here", selectedNEO?.id)
                      }
                      className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600"
                    >
                      Share Discovery! 🌟
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forumPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white/5 p-4 rounded-xl border border-white/10"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                          <AvatarImage src={post.avatar} alt={post.author} />
                          <AvatarFallback>{post.author[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-white">
                              {post.author}
                            </h3>
                            <span className="text-purple-200 text-sm">
                              {post.timestamp}
                            </span>
                          </div>
                          <p className="text-purple-200 mb-4 break-words">
                            {post.content}
                          </p>
                          {post.relatedNeoId && (
                            <div className="bg-purple-500/20 px-3 py-1 rounded-full text-sm text-white inline-block mb-4">
                              🔭 Looking at:{" "}
                              {neoData.find(
                                (neo) => neo.id === post.relatedNeoId
                              )?.name || "Unknown NEO"}
                            </div>
                          )}
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              className="text-white hover:bg-white/10"
                            >
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              {post.likes}
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-white hover:bg-white/10"
                            >
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

        <Dialog open={showDatePicker} onOpenChange={setShowDatePicker}>
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500 p-4">
            <DialogHeader>
              <DialogTitle className="text-white text-lg sm:text-xl">
                Set Your Time Machine! ⏰
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDatePicker(false)}
                className="w-full sm:w-auto text-white border-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDateRangeSubmit}
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600"
              >
                Start Adventure!
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showIntroDialog} onOpenChange={setShowIntroDialog}>
          <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-900 to-blue-900 border-purple-500 p-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-white text-lg sm:text-xl">
                <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
                Welcome Orbit Scouters! 🚀
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-6 text-white">
              <p className="text-base sm:text-lg">
                Get ready for an amazing space adventure! We're going to explore
                special rocks called Near-Earth Objects (NEOs) that float around
                in space near our planet!
              </p>
              <div className="bg-white/10 p-4 sm:p-6 rounded-xl">
                <h3 className="font-semibold mb-4 text-lg sm:text-xl">
                  Your Space Mission:
                </h3>
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
              <Button
                onClick={handleIntroDialogClose}
                className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600"
              >
                Start Your Space Journey! 🌟
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
