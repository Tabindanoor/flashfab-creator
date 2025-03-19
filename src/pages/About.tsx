
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, FileText, Zap } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-6">About Quizlet AI</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>
                Transforming how students learn with AI-powered study tools
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert">
              <p>
                Quizlet AI combines the power of artificial intelligence with proven study techniques to help students learn more effectively and efficiently. 
                Our platform enables you to create personalized study materials from your own documents or build them from scratch.
              </p>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>PDF to Flashcards</CardTitle>
                  <CardDescription>
                    Automatically generate study materials from your documents
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload your PDF documents and our AI will analyze the content to create flashcards with key terms and definitions, saving you hours of manual work.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Brain className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Multiple Learning Modes</CardTitle>
                  <CardDescription>
                    Flashcards, quizzes, and matching games
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Reinforce your learning with different study modes designed to help you test your knowledge from multiple angles and improve retention.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Zap className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>AI-Powered Learning</CardTitle>
                  <CardDescription>
                    Leveraging Google Gemini AI technology
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our platform uses Google Gemini AI to analyze documents, generate high-quality study content, and help you focus on what matters most in your learning materials.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Create Your Own</CardTitle>
                  <CardDescription>
                    Custom study sets for any subject
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create your own study sets from scratch for any subject, customizing terms and definitions to match exactly what you need to learn.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>About the Technology</CardTitle>
              <CardDescription>
                How we use AI to enhance your learning
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray dark:prose-invert">
              <p>
                Quizlet AI integrates Google Gemini API to process and analyze documents, extract key information, and generate study materials. This technology allows us to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Convert PDF documents into structured study sets</li>
                <li>Identify key terms and their definitions from academic content</li>
                <li>Generate quiz questions based on the material</li>
                <li>Create matching exercises that reinforce connections between concepts</li>
              </ul>
              <p className="mt-4">
                Our platform is designed to be educational, accessible, and privacy-focused. We're constantly improving our AI capabilities to better serve learners of all levels.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                To use the AI features, you'll need to provide your own Google Gemini API key, which you can get from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
