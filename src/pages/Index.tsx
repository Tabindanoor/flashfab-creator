
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Plus, BookOpen, Brain, BookOpenCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { initializeWithSampleData } from '@/utils/studySetService';

const Index = () => {
  useEffect(() => {
    // Initialize with sample data if no study sets exist
    initializeWithSampleData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center animate-fade-in">
              <div className="inline-block mb-6">
                <div className="relative bg-primary/10 rounded-2xl p-4 animate-float">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Learn faster with <span className="text-primary">AI-powered</span> study tools
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Upload any PDF and instantly create personalized flashcards, quizzes, and study materials 
                tailored to your learning needs.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/create">
                  <Button size="lg" className="h-12 px-6 rounded-full flex items-center gap-2">
                    Create Study Set
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/study-sets">
                  <Button variant="outline" size="lg" className="h-12 px-6 rounded-full">
                    View Study Sets
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-6 bg-secondary/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Study Tools
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white/70 border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Flashcards</h3>
                  <p className="text-muted-foreground">
                    Practice with AI-generated flashcards created from your PDFs. Flip through terms and definitions to reinforce learning.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <BookOpenCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Quizzes</h3>
                  <p className="text-muted-foreground">
                    Test your knowledge with interactive quizzes. AI generates questions based on your uploaded content.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/70 border-0 shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Matching</h3>
                  <p className="text-muted-foreground">
                    Play matching games to strengthen your memory. Match terms and definitions in a fun, interactive way.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-primary/5 rounded-2xl p-10 md:p-16 text-center">
              <h2 className="text-3xl font-bold mb-6">
                Ready to supercharge your studying?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Upload a PDF now and see how our AI transforms it into effective study materials.
              </p>
              <Link to="/create">
                <Button size="lg" className="h-12 px-6 rounded-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Study Set
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
