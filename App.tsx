import React, { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { PhotoCaptureScreen } from './screens/PhotoCaptureScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { AppState, ScreenName, SeverityLevel, AnalysisResult, NotificationState } from './types';
import { analyzeImage } from './services/geminiService';

const INITIAL_STATE: AppState = {
  currentScreen: ScreenName.HOME,
  selectedImage: null,
  isAnalyzing: false,
  analysisResult: null,
  notification: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  // Auto-dismiss notifications
  useEffect(() => {
    if (state.notification) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, notification: null }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [state.notification]);

  const showNotification = (message: string, type: 'error' | 'warning') => {
    setState(prev => ({ ...prev, notification: { message, type } }));
  };

  const navigateTo = (screen: ScreenName) => {
    setState(prev => ({ ...prev, currentScreen: screen }));
    window.scrollTo(0, 0);
  };

  const handleImageSelected = (image: string) => {
    setState(prev => ({ ...prev, selectedImage: image }));
  };

  const handleAnalyze = async () => {
    if (!state.selectedImage) return;

    try {
      setState(prev => ({ ...prev, isAnalyzing: true }));

      // Call Gemini API
      const geminiResult = await analyzeImage(state.selectedImage);

      const formattedResult: AnalysisResult = {
        severity: geminiResult.severity as SeverityLevel,
        title: geminiResult.title || "Assessment Complete",
        description: geminiResult.description || "The image has been analyzed.",
        firstAidSteps: geminiResult.firstAidSteps || ["Consult a medical professional."],
        confidence: geminiResult.confidence || 0.0,
        urgencyMessage: geminiResult.urgencyMessage || "Check details below",
        recommendation: geminiResult.recommendation || "DOCTOR",
      };

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisResult: formattedResult,
        currentScreen: ScreenName.RESULTS
      }));
    } catch (error) {
      console.error(error);
      showNotification("❌ Failed to analyze image. Please try again.", "error");

      setState(prev => ({
        ...prev,
        isAnalyzing: false
      }));
    }
  };

  const handleStartOver = () => {
    setState(INITIAL_STATE);
    window.scrollTo(0, 0);
  };

  const renderScreen = () => {
    switch (state.currentScreen) {
      case ScreenName.HOME:
        return (
          <HomeScreen
            onNavigateToPhoto={() => navigateTo(ScreenName.PHOTO_CAPTURE)}
            onNavigateToVoice={() => alert("Voice feature coming soon!")}
          />
        );

      case ScreenName.PHOTO_CAPTURE:
        return (
          <PhotoCaptureScreen
            onBack={() => navigateTo(ScreenName.HOME)}
            onImageSelected={handleImageSelected}
            onAnalyze={handleAnalyze}
            isAnalyzing={state.isAnalyzing}
            selectedImage={state.selectedImage}
            onError={(msg) => showNotification(msg, 'error')}
            onWarning={(msg) => showNotification(msg, 'warning')}
          />
        );

      case ScreenName.RESULTS:
        return (
          <ResultsScreen
            result={state.analysisResult}
            onBack={() => navigateTo(ScreenName.HOME)}
            onStartOver={handleStartOver}
          />
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">

        {/* NOTIFICATION TOAST */}
        {state.notification && (
          <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md p-4 rounded-xl shadow-2xl z-[100] animate-in slide-in-from-top-4 fade-in duration-300 flex items-center gap-3 border-l-8 ${
              state.notification.type === 'error'
                ? 'bg-white text-gray-800 border-red-500'
                : 'bg-white text-gray-800 border-yellow-400'
            }`}
          >
            <p className="font-bold text-sm leading-snug">{state.notification.message}</p>
          </div>
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 pb-16">
          {renderScreen()}
        </main>

        {/* STICKY FOOTER */}
        <footer className="fixed bottom-0 w-full max-w-md bg-red-50 border-t border-red-100 p-3 text-center z-50">
          <p className="text-xs text-red-600 font-semibold flex items-center justify-center gap-2">
            <span role="img" aria-label="warning">⚠️</span>
            Not medical advice. Call 911 for emergencies.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default App;
