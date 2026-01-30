
export enum ProcessingMode {
  DIRECT = 'DIRECT',
  REDRAW = 'REDRAW'
}

export interface ImageResult {
  id: string;
  url: string;
  prompt?: string;
  mode: ProcessingMode;
  timestamp: number;
}

export interface AppState {
  originalImage: string | null;
  analyzing: boolean;
  processing: boolean;
  imageDescription: string;
  suggestedPrompt: string;
  results: ImageResult[];
  error: string | null;
}
