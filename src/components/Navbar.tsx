
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen } from 'lucide-react';
import { useAuth, UserButton, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glassmorphism border-b border-gray-200/30 py-3">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">Quizlet AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/study-sets" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            My Study Sets
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            About
          </Link>
          {isSignedIn && (
            <Link to="/dashboard" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link to="/create">
                <Button className="rounded-full px-4 py-2 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors" variant="default">
                  Create <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="h-9">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="rounded-full px-4 py-2 h-9 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  Sign Up <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
