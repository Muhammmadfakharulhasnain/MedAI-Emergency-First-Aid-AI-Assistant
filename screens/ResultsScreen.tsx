import React, { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { ArrowLeftIcon, AlertTriangleIcon, CheckCircleIcon } from '../components/Icons';
import { AnalysisResult, SeverityLevel } from '../types';
import { 
  calculateTriageScore, 
  generateFirstAidPlan, 
  getSeverityLabel, 
  getUrgencyMessage, 
  logTriageToFirestore 
} from '../services/triageService';

interface ResultsScreenProps {
  result: AnalysisResult | null;
  onBack: () => void;
  onStartOver: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onBack, onStartOver }) => {
  const [triageScore, setTriageScore] = useState<any>(null);
  const [firstAidPlan, setFirstAidPlan] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<any>(null);

  useEffect(() => {
    if (!result) return;

    // Run triage logic
    const scored = calculateTriageScore(result);
    setTriageScore(scored);

    // Generate specific plan based on recalculated severity
    const plan = generateFirstAidPlan(result.title, scored.finalSeverity, result.firstAidSteps);
    setFirstAidPlan(plan);

    // Determine urgency UI
    setUrgency(getUrgencyMessage(scored.finalSeverity));

    // Log the session
    const enhancedData = {
      ...scored,
      injuryType: result.title,
      severityLabel: getSeverityLabel(scored.finalSeverity)
    };
    logTriageToFirestore(enhancedData);

  }, [result]);

  if (!result || !triageScore || !urgency) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007AFF]"></div>
        <p className="mt-4 text-gray-500 font-medium">Finalizing Triage...</p>
      </div>
    );
  }

  // Map severity level to colors using the snippet's logic but with Tailwind classes
  const getSeverityStyles = (severity: number) => {
    switch (severity) {
      case 1: return { bg: 'bg-[#34C759]', text: 'text-white', ring: 'border-[#248A3D]' };
      case 2: return { bg: 'bg-[#FFCC00]', text: 'text-gray-900', ring: 'border-[#B28E00]' };
      case 3: return { bg: 'bg-[#FF9500]', text: 'text-gray-900', ring: 'border-[#CC7700]' };
      case 4: return { bg: 'bg-[#FF6B35]', text: 'text-white', ring: 'border-[#B34015]' };
      case 5: return { bg: 'bg-[#FF3B30]', text: 'text-white', ring: 'border-[#B31D12]' };
      default: return { bg: 'bg-gray-500', text: 'text-white', ring: 'border-gray-700' };
    }
  };

  const severityStyle = getSeverityStyles(triageScore.finalSeverity);

  // Helper to safely access optional fields from result (if they exist in future)
  const redFlags = (result as any).redFlags;
  const disclaimer = (result as any).disclaimer || "AI analysis can be wrong. Always seek professional help for emergencies.";

  return (
    <div className="flex flex-col min-h-full bg-gray-50 pb-24">
       {/* Header - Medical Blue */}
       <div className="flex items-center p-4 bg-[#007AFF] text-white shadow-md sticky top-0 z-20 min-h-[72px]">
        <button 
          onClick={onBack}
          className="w-12 h-12 -ml-2 flex items-center justify-center rounded-full hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-white/50 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-7 h-7" />
        </button>
        <h1 className="ml-2 text-2xl font-bold tracking-tight">Triage Assessment</h1>
      </div>

      <div className="px-6 py-8 flex flex-col items-center">
        
        {/* Severity Badge */}
        <div className={`relative flex flex-col items-center justify-center w-56 h-56 rounded-full shadow-2xl mb-8 ${severityStyle.bg} ${severityStyle.text} transition-transform hover:scale-105 border-4 ${severityStyle.ring}`}>
            <span className="text-8xl font-black">{triageScore.finalSeverity}</span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black uppercase tracking-widest mt-2 opacity-90">
                {triageScore.severityLabel}
              </span>
              <span className="text-xs font-bold opacity-75">Scale 1-5</span>
            </div>
        </div>

        {/* Escalation Notice */}
        {triageScore.escalated && (
          <div className="w-full bg-red-50 border-l-8 border-red-500 p-4 rounded-r-xl mb-8 shadow-sm animate-pulse">
             <div className="flex items-start gap-3">
                <AlertTriangleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-red-800 text-lg">Safety Escalation</h3>
                  <p className="text-red-700 text-sm font-medium">{triageScore.escalationReason}</p>
                </div>
             </div>
          </div>
        )}

        {/* Urgency Message */}
        <div 
          className="w-full p-6 rounded-2xl border-l-8 mb-8 flex items-center gap-5 shadow-sm bg-white"
          style={{ borderColor: urgency.color }}
        >
          <div className="text-4xl">
             {urgency.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl" style={{ color: urgency.color }}>{urgency.text}</h3>
            <p className="text-base text-gray-600 font-medium mt-1">Based on visual analysis</p>
          </div>
        </div>

        {/* Confidence */}
        <div className="w-full flex justify-between items-center px-2 mb-8">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wide">AI Confidence</span>
            <span className="text-base font-bold text-[#007AFF] bg-blue-50 px-4 py-2 rounded-full">
              {triageScore.confidenceLevel}%
            </span>
        </div>

        {/* Injury Details Card */}
        <div className="w-full bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#007AFF]"></span>
                Injury Type
            </h3>
            <p className="text-2xl font-bold text-gray-900 mb-3">{triageScore.injuryType}</p>
            <p className="text-gray-700 leading-relaxed text-lg">{result.description}</p>
        </div>

        {/* First Aid Steps Card */}
        <div className="w-full bg-white rounded-3xl p-8 mb-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-6 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#007AFF]"></span>
                Action Plan
            </h3>
            <ol className="space-y-6">
                {firstAidPlan.map((step, idx) => (
                    <li key={idx} className="flex gap-5">
                        <span className="flex-shrink-0 w-10 h-10 bg-[#007AFF] text-white font-bold rounded-full flex items-center justify-center text-lg shadow-md shadow-blue-200">
                          {idx + 1}
                        </span>
                        <span className="text-gray-800 leading-relaxed font-medium text-lg pt-1">{step}</span>
                    </li>
                ))}
            </ol>
        </div>

        {/* Red Flags (Optional) */}
        {redFlags && redFlags.length > 0 && (
          <div className="w-full bg-red-50 rounded-3xl p-6 mb-6 shadow-sm border border-red-100">
             <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                🚩 Red Flags Detected
            </h3>
            <ul className="space-y-2">
              {redFlags.map((flag: string, i: number) => (
                <li key={i} className="text-red-800 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 italic text-center mb-8 px-4">
          ⚠️ {disclaimer}
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-6">
            {triageScore.finalSeverity >= 3 && (
                <Button 
                  variant={triageScore.finalSeverity >= 5 ? "danger" : "primary"} 
                  size="lg" 
                  fullWidth 
                  className="shadow-xl py-6 text-xl animate-pulse"
                  onClick={() => {
                     // Placeholder for ER Locator
                     alert('🏥 ER Locator feature would open here.\n\nSimulated: Finding nearest hospital...');
                  }}
                >
                    {triageScore.finalSeverity >= 5 ? "🚨 CALL 911" : "🏥 Find Nearest ER"}
                </Button>
            )}

             {triageScore.finalSeverity >= 5 && (
                 <Button 
                 variant="primary" 
                 size="lg" 
                 fullWidth 
                 className="shadow-md py-6 text-xl"
                 onClick={() => {
                    alert('🏥 ER Locator feature would open here.');
                 }}
               >
                 🏥 Find Nearest ER
               </Button>
             )}
            
            <Button variant="secondary" size="lg" fullWidth onClick={onStartOver} className="py-6 text-xl">
                🔄 Start Over
            </Button>
        </div>
      </div>
    </div>
  );
};