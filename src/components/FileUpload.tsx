
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  accept?: string;
  isLoading?: boolean;
}

const FileUpload = ({ onFileChange, accept = ".pdf", isLoading = false }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      onFileChange(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files?.length) {
      const droppedFile = e.dataTransfer.files[0];
      
      if (droppedFile.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      
      setFile(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 transition-all duration-300 ease-in-out hover:border-primary/50 text-center cursor-pointer animate-pulse-slow"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground mb-1">
                Upload PDF
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload (10MB max)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="truncate">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={removeFile}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
