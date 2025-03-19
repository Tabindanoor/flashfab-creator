
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Plus, Search, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StudySet from '@/components/StudySet';
import { StudySet as StudySetType } from '@/types';
import { getStudySets, deleteStudySet } from '@/utils/studySetService';

const StudySets = () => {
  const [studySets, setStudySets] = useState<StudySetType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteStudySetId, setDeleteStudySetId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load study sets from local storage
    loadStudySets();
  }, []);

  const loadStudySets = () => {
    const sets = getStudySets();
    setStudySets(sets);
  };

  const filteredStudySets = studySets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteStudySet = (id: string) => {
    const success = deleteStudySet(id);
    
    if (success) {
      toast({
        description: "Study set deleted successfully",
      });
      loadStudySets();
    } else {
      toast({
        title: "Error",
        description: "Failed to delete study set",
        variant: "destructive",
      });
    }
    
    setDeleteStudySetId(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Study Sets</h1>
              <p className="text-muted-foreground mt-1">
                Manage and study with your saved study sets
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search study sets..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Link to="/create">
                <Button className="flex items-center gap-1 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  New Set
                </Button>
              </Link>
            </div>
          </div>
          
          {studySets.length === 0 ? (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>No study sets yet</CardTitle>
                <CardDescription>
                  Create your first study set to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/create">
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Create Study Set
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredStudySets.length === 0 ? (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>No results found</CardTitle>
                <CardDescription>
                  No study sets match your search query.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')} 
                  className="mr-2"
                >
                  Clear Search
                </Button>
                <Link to="/create">
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Create Study Set
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudySets.map((studySet) => (
                <div key={studySet.id} className="group relative">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteStudySetId(studySet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete study set?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{studySet.title}" and all of its flashcards. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteStudySet(studySet.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <StudySet
                    id={studySet.id}
                    title={studySet.title}
                    description={studySet.description}
                    cards={studySet.cards.length}
                    createdAt={studySet.createdAt}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StudySets;
