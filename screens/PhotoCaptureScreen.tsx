import React, { useState, useRef, useCallback } from 'react';
import { Button } from '../components/Button';
import { ArrowLeftIcon, UploadIcon, CrossIcon } from '../components/Icons';

interface PhotoCaptureScreenProps {
  onBack: () => void;
  onImageSelected: (image: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  selectedImage: string | null;
  onError: (msg: string) => void;
  onWarning: (msg: string) => void;
}

export const PhotoCaptureScreen: React.FC<PhotoCaptureScreenProps> = ({
  onBack,
  onImageSelected,
  onAnalyze,
  isAnalyzing,
  selectedImage,
  onError,
  onWarning
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        onError("❌ Unable to upload photo. Please try again.");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelected(e.target.result as string);
        } else {
          onError("❌ Unable to upload photo. Please try again.");
        }
      };
      reader.onerror = () => {
        onError("❌ Unable to upload photo. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [onImageSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleAnalyzeClick = () => {
    if (!selectedImage) {
      onWarning("⚠️ Please select a photo first.");
      return;
    }
    onAnalyze();
  };

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Header - Medical Blue */}
      <div className="flex items-center p-4 bg-[#007AFF] text-white shadow-md z-10 min-h-[72px]">
        <button 
          onClick={onBack}
          className="w-12 h-12 -ml-2 flex items-center justify-center rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-white/50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="ml-2 text-2xl font-bold tracking-tight">Upload Injury Photo</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center">
        {/* Upload Zone */}
        {!selectedImage ? (
          <div 
            className={`w-full max-w-md aspect-[4/3] rounded-3xl border-4 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer bg-white shadow-sm
              ${dragActive ? 'border-[#007AFF] bg-blue-50' : 'border-gray-300 hover:border-[#007AFF] hover:bg-blue-50/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
            aria-label="Upload image area. Drag and drop or tap to select."
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-[#007AFF]">
              <UploadIcon className="w-12 h-12" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Tap to select photo</p>
            <p className="text-lg text-gray-500">or Drag and drop here</p>
          </div>
        ) : (
          <div className="w-full max-w-md relative animate-in fade-in zoom-in duration-300">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-black">
                <img 
                src={selectedImage} 
                alt="Preview" 
                className="w-full h-auto object-contain max-h-[60vh]"
                />
            </div>
            <button
              onClick={() => onImageSelected('')} // Clear image
              className="absolute top-4 right-4 w-14 h-14 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg text-white hover:bg-red-600 transition-colors focus:ring-4 focus:ring-white"
              aria-label="Remove image"
            >
              <CrossIcon className="w-8 h-8" />
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Action Button */}
        <div className="w-full max-w-md mt-8 mb-6">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            isLoading={isAnalyzing}
            className="shadow-xl shadow-blue-500/30 text-xl py-6"
          >
            ✅ Analyze Injury with AI
          </Button>
        </div>
      </div>
    </div>
  );
};
