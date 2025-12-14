export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

export interface DiagramData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}
