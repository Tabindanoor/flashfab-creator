
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import Navbar from '@/components/Navbar';
import { getStudyAnalytics } from '@/utils/analyticsService';
import { StudyAnalytics } from '@/types';
import { BookOpen, Clock, Award, BrainCircuit, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<StudyAnalytics | null>(null);
  
  useEffect(() => {
    // Only show dashboard for signed in users
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
      return;
    }
    
    // Load analytics data
    const data = getStudyAnalytics();
    setAnalytics(data);
  }, [isLoaded, isSignedIn, navigate]);
  
  if (!analytics) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-4">Loading dashboard...</h1>
        </div>
      </>
    );
  }
  
  // Prepare data for charts
  const modeData = [
    { name: 'Flashcards', value: analytics.sessionsByMode.flashcards },
    { name: 'Quiz', value: analytics.sessionsByMode.quiz },
    { name: 'Match', value: analytics.sessionsByMode.match }
  ];
  
  const studySetData = Object.entries(analytics.studySetProgress).map(([id, data]) => ({
    name: data.setTitle.length > 15 ? data.setTitle.substring(0, 15) + '...' : data.setTitle,
    score: Math.round(data.averageScore),
    sessions: data.sessionsCount
  }));
  
  const masteryColors = {
    beginner: '#94a3b8',
    intermediate: '#60a5fa',
    advanced: '#a78bfa',
    master: '#f59e0b'
  };
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Study Dashboard</h1>
        
        {/* Top stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Study Sessions</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalSessions}</div>
              <p className="text-xs text-muted-foreground">Across all study modes</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(analytics.totalTimeSpentMinutes)} min</div>
              <p className="text-xs text-muted-foreground">Total study time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(analytics.averageScore)}%</div>
              <Progress value={analytics.averageScore} className="h-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Study Sets</CardTitle>
              <BrainCircuit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(analytics.studySetProgress).length}</div>
              <p className="text-xs text-muted-foreground">Created study materials</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Study Activities</CardTitle>
              <CardDescription>Sessions by study mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer 
                  config={{
                    Flashcards: { color: COLORS[0] },
                    Quiz: { color: COLORS[1] },
                    Match: { color: COLORS[2] }
                  }}
                >
                  <PieChart>
                    <Pie
                      data={modeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {modeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Study Set Performance</CardTitle>
              <CardDescription>Average scores by study set</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ChartContainer 
                  config={{
                    score: { color: "#3b82f6" }
                  }}
                >
                  <BarChart data={studySetData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="#3b82f6" name="Score (%)" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Study set progress */}
        <h2 className="text-xl font-bold mb-4">Study Set Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(analytics.studySetProgress).map(([id, data]) => (
            <Card key={id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{data.setTitle}</CardTitle>
                <CardDescription>Last studied: {new Date(data.lastStudied).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Average Score</span>
                  <span className="font-medium">{Math.round(data.averageScore)}%</span>
                </div>
                <Progress value={data.averageScore} className="h-2 mb-4" />
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: masteryColors[data.masteryLevel] }}
                    />
                    <span className="capitalize text-sm">{data.masteryLevel}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.sessionsCount} sessions</span>
                </div>
              </CardContent>
              <CardFooter>
                <a 
                  href={`/study/${id}/flashcards`} 
                  className="text-sm text-primary hover:underline"
                >
                  Study Now
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Difficult cards */}
        {analytics.difficultCards.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Cards to Review</h2>
            <div className="space-y-4 mb-8">
              {analytics.difficultCards.slice(0, 5).map((card) => (
                <Card key={card.cardId} className="hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Term</h3>
                        <p className="font-medium">{card.term}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Definition</h3>
                        <p>{card.definition}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Difficult card ({card.incorrectCount} incorrect answers)
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
