import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Award, Star, Rocket, Brain, Play } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/navbar';

const LearningHubPage = () => {
  const spaceTopics = [
    {
      id: 1,
      title: "Asteroid Adventures",
      description: "Learn about different types of asteroids and why they're so important!",
      progress: 75,
      modules: 4,
      completed: 3,
      icon: <Star className="h-8 w-8 text-yellow-300" />
    },
    {
      id: 2,
      title: "Space Safety Patrol",
      description: "Discover how scientists track near-Earth objects to keep our planet safe.",
      progress: 50,
      modules: 6,
      completed: 3,
      icon: <Brain className="h-8 w-8 text-blue-300" />
    }
  ];

  const achievements = [
    {
      title: "First Contact",
      description: "Completed your first space mission",
      icon: "🚀"
    },
    {
      title: "Star Student",
      description: "Finished 5 learning modules",
      icon: "⭐"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900">
      <Navbar/>

      <main className="max-w-7xl mx-auto px-5">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                <Rocket className="h-6 w-6 text-yellow-300" />
                Your Space Learning Journey
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {spaceTopics.map(topic => (
                  <Card key={topic.id} className="bg-white/10 backdrop-blur-md border-white/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        {topic.icon}
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-2">{topic.title}</h3>
                          <p className="text-purple-200 text-sm mb-4">{topic.description}</p>
                          <Progress value={topic.progress} className="mb-2" />
                          <p className="text-white text-sm">
                            {topic.completed} of {topic.modules} modules completed
                          </p>
                          <Button className="mt-4 w-full bg-purple-500 hover:bg-purple-600">
                            <Play className="h-4 w-4 mr-2" /> Continue Learning
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                  <Play className="h-6 w-6 text-yellow-300" />
                  Fun Space Activities
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-white mb-2">Space Quiz Challenge</h3>
                    <p className="text-purple-200 mb-4">Test your knowledge about asteroids and earn cosmic points!</p>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">Start Quiz</Button>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="font-semibold text-white mb-2">Virtual Observatory</h3>
                    <p className="text-purple-200 mb-4">Use our virtual telescope to explore the night sky!</p>
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">Launch</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Award className="h-5 w-5 text-yellow-300" />
                  Your Achievements
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <p className="text-purple-200 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                  <Star className="h-5 w-5 text-yellow-300" />
                  Weekly Challenge
                </h2>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h3 className="font-semibold text-white mb-2">Asteroid Spotter</h3>
                  <p className="text-purple-200 mb-4">Find and document 5 different asteroids this week!</p>
                  <Progress value={60} className="mb-2" />
                  <p className="text-white text-sm">3 of 5 asteroids spotted</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningHubPage;