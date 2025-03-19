
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200/30 py-6 mt-auto">
      <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Quizlet AI. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
