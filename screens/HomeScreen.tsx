import React from 'react';
import { Button } from '../components/Button';
import { CameraIcon, MicIcon } from '../components/Icons';

interface HomeScreenProps {
  onNavigateToPhoto: () => void;
  onNavigateToVoice: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToPhoto, onNavigateToVoice }) => {
  return (
    <div className="flex flex-col min-h-full">
      {/* Header Area - Prominent Medical Blue */}
      <div className="flex flex-col items-center justify-center pt-12 pb-12 px-6 text-center bg-[#007AFF] rounded-b-[2.5rem] shadow-md">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
          <span className="text-5xl" role="img" aria-label="Hospital">🏥</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">MedAI</h1>
        <p className="text-xl text-blue-100 font-medium">Instant injury triage using AI</p>
      </div>

      {/* Main Actions - Increased Spacing (gap-6 = 24px) */}
      <div className="flex-1 px-6 -mt-8 flex flex-col gap-6">
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={onNavigateToPhoto}
          aria-label="Upload Injury Photo"
          className="shadow-xl shadow-blue-900/20 py-6 border-2 border-white"
        >
          <CameraIcon className="mr-4 w-8 h-8" />
          Upload Injury Photo
        </Button>
        
        <Button 
          variant="primary" 
          size="lg" 
          fullWidth 
          onClick={onNavigateToVoice}
          aria-label="Describe Symptoms"
          className="shadow-xl shadow-blue-900/20 py-6 border-2 border-white"
        >
          <MicIcon className="mr-4 w-8 h-8" />
          Describe Symptoms
        </Button>
      </div>

      {/* How it works - Increased Spacing */}
      <div className="px-6 py-10 mt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-1">How MedAI Works</h2>
        <ul className="space-y-4">
          {[
            { icon: "📸", text: "Upload a photo of the injury" },
            { icon: "🤖", text: "AI instantly analyzes" },
            { icon: "📋", text: "Get first aid steps" },
            { icon: "🚨", text: "Know when to call 911" }
          ].map((item, index) => (
            <li key={index} className="flex items-center text-gray-700 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <span className="text-3xl mr-5">{item.icon}</span>
              <span className="font-medium text-gray-900 text-lg">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-24" /> 
    </div>
  );
};
