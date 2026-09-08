interface YachaySpeechRecognitionResult {
  0?: { transcript: string };
}

interface YachaySpeechRecognitionEvent {
  results: ArrayLike<YachaySpeechRecognitionResult>;
}

interface YachaySpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: YachaySpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}

interface YachaySpeechRecognitionConstructor {
  new (): YachaySpeechRecognition;
}

interface Window {
  SpeechRecognition?: YachaySpeechRecognitionConstructor;
  webkitSpeechRecognition?: YachaySpeechRecognitionConstructor;
}
