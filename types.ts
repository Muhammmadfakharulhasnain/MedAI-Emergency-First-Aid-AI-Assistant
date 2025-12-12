export enum ScreenName {
  HOME = 'HOME',
  PHOTO_CAPTURE = 'PHOTO_CAPTURE',
  VOICE_INPUT = 'VOICE_INPUT',
  RESULTS = 'RESULTS',
}

export enum SeverityLevel {
  MINOR = 1,
  MODERATE = 2,
  SEVERE = 3,
  CRITICAL = 4,
}

export interface AnalysisResult {
  severity: SeverityLevel;
  title: string;
  description: string;
  firstAidSteps: string[];
  confidence: number;
  urgencyMessage: string;
  recommendation: 'HOME_CARE' | 'DOCTOR' | 'ER' | '911';
}

export interface NotificationState {
  message: string;
  type: 'error' | 'warning';
}

export interface AppState {
  currentScreen: ScreenName;
  selectedImage: string | null; // Base64 or Blob URL
  isAnalyzing: boolean;
  analysisResult: AnalysisResult | null;
  notification: NotificationState | null;
}
