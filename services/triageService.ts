// services/triageService.ts
import { db, serverTimestamp } from '../config/firebase';

const SEVERITY_KEYWORDS = {
  critical: [
    'severe bleeding', 'heavy bleeding', 'unconscious', 'chest pain', 'choking',
    'severe burn', 'deep wound', 'amputation', 'shock', 'severe fracture'
  ],
  high: [
    'bleeding', 'open wound', 'laceration', 'deep cut', 'puncture', 'fracture',
    'dislocation', 'severe swelling', 'high fever'
  ],
  moderate: [
    'minor wound', 'shallow cut', 'scrape', 'bruise', 'mild swelling', 'mild pain'
  ]
};

// Calculate triage score
export function calculateTriageScore(geminiResult: any) {
  // Extract fields, mapping 'title' from geminiResult to 'injuryType' if needed
  let { severity, title, description, confidence } = geminiResult;
  const injuryType = title || "Unknown Injury";
  
  let escalated = false;
  let escalationReason = '';

  const allText = `${injuryType} ${description || ''}`.toLowerCase();

  // Check Critical Keywords
  for (const keyword of SEVERITY_KEYWORDS.critical) {
    if (allText.includes(keyword)) {
      if (severity < 5) { 
        severity = 5; 
        escalated = true; 
        escalationReason = `Critical keyword: "${keyword}"`; 
      }
      break;
    }
  }

  // Check High Severity Keywords
  if (!escalated) {
    for (const keyword of SEVERITY_KEYWORDS.high) {
      if (allText.includes(keyword)) {
        if (severity < 4) { 
          severity = 4; 
          escalated = true; 
          escalationReason = `High-severity keyword: "${keyword}"`; 
        }
        break;
      }
    }
  }

  // Adjust for Low Confidence
  if (confidence < 0.6) {
    severity = Math.min(severity + 1, 5);
    escalationReason += (escalationReason ? '; ' : '') + 'Low confidence score';
  }

  return {
    finalSeverity: severity,
    escalated,
    escalationReason,
    confidenceLevel: Math.round(confidence * 100),
    injuryType,
    severityLabel: getSeverityLabel(severity)
  };
}

// Generate first aid plan
export function generateFirstAidPlan(injuryType: string, severity: number, geminiSteps: string[] = []) {
  const steps = [...(geminiSteps || [])];
  if (severity >= 5) {
    steps.unshift('🚨 CALL 911 IMMEDIATELY');
    steps.push('Keep victim calm and still');
  } else if (severity >= 4) {
    steps.unshift('⚠️ Go to nearest Emergency Room');
  } else if (severity >= 3) {
    steps.unshift('Visit a doctor within 24 hours');
  } else {
    steps.unshift('Monitor the injury');
  }
  return steps;
}

// Severity label
export function getSeverityLabel(severity: number) {
  const labels: Record<number, string> = { 1: 'Minor', 2: 'Moderate', 3: 'Moderate-Severe', 4: 'Severe', 5: 'Critical' };
  return labels[severity] || 'Unknown';
}

// Urgency message
export function getUrgencyMessage(severity: number) {
  const messages: Record<number, any> = {
    1: { icon: '✅', text: 'Home care sufficient', color: '#34C759' },
    2: { icon: '⚠️', text: 'See doctor within 24-48 hours', color: '#FFCC00' },
    3: { icon: '⚠️', text: 'Visit ER today', color: '#FF9500' },
    4: { icon: '🚨', text: 'ER urgent (next 1-2 hours)', color: '#FF6B35' },
    5: { icon: '🚨', text: 'Call 911 immediately', color: '#FF3B30' }
  };
  return messages[severity] || messages[3];
}

// Log to Firestore
export async function logTriageToFirestore(triageData: any) {
  try {
    const triageRef = db.collection('triage_sessions');
    
    const docData = {
      timestamp: serverTimestamp(),
      severity: triageData.finalSeverity,
      severityLabel: triageData.severityLabel,
      injuryType: triageData.injuryType,
      confidence: triageData.confidenceLevel,
      escalated: triageData.escalated,
      escalationReason: triageData.escalationReason || '',
      userAgent: navigator.userAgent
    };

    const docRef = await triageRef.add(docData);
    console.log('Triage logged to Firestore:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error logging to Firestore:', error);
    return null;
  }
}