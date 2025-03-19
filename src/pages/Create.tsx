
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Trash2, Upload, SaveIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import FileUpload from '@/components/FileUpload';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createStudySet } from '@/utils/studySetService';

interface FormData {
  title: string;
  description: string;
  cards: { term: string; definition: string }[];
}

// This function simulates using the Google Gemini API to extract flashcards from PDF
// In a real app, this would call an API endpoint that processes the PDF with the Gemini API
const simulateAIExtraction = async (file: File): Promise<{ title: string; cards: { term: string; definition: string }[] }> => {
  // Simulate loading time
  return new Promise((resolve) => {
    setTimeout(() => {
      // This is mock data - in a real app, this would come from the AI model
      const fileName = file.name.replace('.pdf', '');
      resolve({
        title: fileName,
        cards: [
          { term: "Artificial Intelligence", definition: "The simulation of human intelligence processes by machines, especially computer systems." },
          { term: "Machine Learning", definition: "An application of AI that provides systems the ability to automatically learn and improve from experience without being explicitly programmed." },
          { term: "Neural Network", definition: "A computer system modeled on the human brain and nervous system." },
          { term: "Deep Learning", definition: "A subset of machine learning that uses neural networks with many layers." },
          { term: "Natural Language Processing", definition: "A field of AI that gives computers the ability to understand text and spoken words." },
          { term: "Computer Vision", definition: "A field of AI that enables computers to see, identify and process images in the same way that human vision does." },
          { term: "Reinforcement Learning", definition: "A type of machine learning based on rewarding desired behaviors and punishing undesired ones." },
          { term: "Supervised Learning", definition: "The machine learning task of learning a function that maps an input to an output based on example input-output pairs." },
        ]
      });
    }, 2000);
  });
};

const Create = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    cards: [{ term: '', definition: '' }]
  });
  const [activeTab, setActiveTab] = useState<string>('upload');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleProcessPDF = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a PDF file to continue",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Call the AI function (simulated for now)
      const result = await simulateAIExtraction(selectedFile);
      
      // Update form with extracted data
      setFormData({
        title: result.title,
        description: `Study set generated from ${selectedFile.name}`,
        cards: result.cards
      });
      
      // Switch to the edit tab
      setActiveTab('edit');
      
      toast({
        title: "PDF processed successfully",
        description: `${result.cards.length} flashcards created`,
      });
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "Error processing PDF",
        description: "There was an error processing your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (index: number, field: 'term' | 'definition', value: string) => {
    const updatedCards = [...formData.cards];
    updatedCards[index][field] = value;
    setFormData(prev => ({ ...prev, cards: updatedCards }));
  };

  const addCard = () => {
    setFormData(prev => ({
      ...prev,
      cards: [...prev.cards, { term: '', definition: '' }]
    }));
  };

  const removeCard = (index: number) => {
    if (formData.cards.length <= 1) {
      toast({
        description: "You need at least one card in your study set",
        variant: "destructive",
      });
      return;
    }
    
    const updatedCards = formData.cards.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, cards: updatedCards }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your study set",
        variant: "destructive",
      });
      return;
    }

    if (formData.cards.some(card => !card.term.trim() || !card.definition.trim())) {
      toast({
        title: "Incomplete cards",
        description: "Please fill in all terms and definitions",
        variant: "destructive",
      });
      return;
    }

    // Create study set
    try {
      const newStudySet = createStudySet(
        formData.title,
        formData.description,
        formData.cards
      );
      
      toast({
        title: "Study set created!",
        description: `"${formData.title}" with ${formData.cards.length} cards`
      });
      
      // Navigate to the study set page
      navigate(`/study-sets`);
    } catch (error) {
      console.error("Error creating study set:", error);
      toast({
        title: "Error creating study set",
        description: "There was an error creating your study set. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-6">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-6">Create Study Set</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload PDF</TabsTrigger>
              <TabsTrigger value="edit">Edit Study Set</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload a PDF</CardTitle>
                  <CardDescription>
                    Upload a PDF file to automatically generate flashcards using AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <FileUpload 
                      onFileChange={handleFileChange}
                      isLoading={isProcessing}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab('edit')}
                  >
                    Skip and Create Manually
                  </Button>
                  <Button 
                    onClick={handleProcessPDF}
                    disabled={!selectedFile || isProcessing}
                    className="flex items-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Process PDF
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="edit" className="mt-6">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Study Set Details</CardTitle>
                    <CardDescription>
                      Edit your study set information and flashcards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Biology 101"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Add a description for your study set"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Flashcards</h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCard}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          Add Card
                        </Button>
                      </div>
                      
                      <div className="space-y-6">
                        {formData.cards.map((card, index) => (
                          <Card key={index} className="relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeCard(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                            
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`term-${index}`}>Term</Label>
                                  <Input
                                    id={`term-${index}`}
                                    value={card.term}
                                    onChange={(e) => handleCardChange(index, 'term', e.target.value)}
                                    placeholder="Enter a term"
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor={`definition-${index}`}>Definition</Label>
                                  <Input
                                    id={`definition-${index}`}
                                    value={card.definition}
                                    onChange={(e) => handleCardChange(index, 'definition', e.target.value)}
                                    placeholder="Enter a definition"
                                    required
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="submit"
                      className="flex items-center gap-2"
                    >
                      <SaveIcon className="h-4 w-4" />
                      Create Study Set
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Create;
