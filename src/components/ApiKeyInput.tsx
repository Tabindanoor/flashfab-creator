
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { GeminiService } from '@/utils/geminiService';
import { KeyRound, Check, X } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key is already stored
    const storedKey = GeminiService.getApiKey();
    setHasKey(!!storedKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key",
        variant: "destructive",
      });
      return;
    }

    GeminiService.saveApiKey(apiKey);
    setHasKey(true);
    setApiKey('');
    
    toast({
      title: "API Key Saved",
      description: "Your Google Gemini API key has been saved successfully",
    });
    
    onApiKeySet();
  };

  const handleReset = () => {
    localStorage.removeItem('gemini_api_key');
    setHasKey(false);
    
    toast({
      title: "API Key Removed",
      description: "Your Google Gemini API key has been removed",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Google Gemini API Key</CardTitle>
        <CardDescription>
          {hasKey 
            ? "You have already set your Google Gemini API key" 
            : "Enter your Google Gemini API key to use AI features"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasKey ? (
          <div className="flex items-center justify-center gap-2 py-2">
            <Check className="h-5 w-5 text-green-500" />
            <p className="text-sm text-muted-foreground">API key is set and ready to use</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <KeyRound className="h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google Gemini API key"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              You can get your API key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
              Your key will be stored locally in your browser.
            </p>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {hasKey ? (
          <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Reset API Key
          </Button>
        ) : (
          <Button type="submit" onClick={handleSubmit} className="flex items-center gap-1">
            <Check className="h-4 w-4" />
            Save API Key
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApiKeyInput;
