'use client';

import { useState, useRef } from 'react';
import { transcribeAudio } from './_actions/transcribe';

export default function TranscribePage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError('Error accessing microphone. Please ensure you have granted permission.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!audioURL) {
      setError('Please record audio first');
      return;
    }

    try {
      setIsTranscribing(true);
      setError(null);

      // Convert audioURL to File
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      const audioFile = new File([audioBlob], 'recording.mp3', { type: 'audio/mpeg' });

      // Add file to FormData
      formData.set('audio', audioFile);

      const result = await transcribeAudio(formData);
      setTranscription(result);
    } catch (err: any) {
      setError(`Transcription error: ${err.message}`);
      console.error('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Audio Transcription</h1>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
          >
            Start Recording
          </button>

          <button
            type="button"
            onClick={stopRecording}
            disabled={!isRecording}
            className="px-4 py-2 bg-red-600 text-white rounded-md disabled:bg-red-300"
          >
            Stop Recording
          </button>
        </div>

        {audioURL && (
          <div className="mb-4">
            <p className="mb-2">Preview your recording:</p>
            <audio src={audioURL} controls className="w-full" />
          </div>
        )}
      </div>

      <form action={handleSubmit} className="mb-8">
        <button
          type="submit"
          disabled={!audioURL || isTranscribing}
          className="px-4 py-2 bg-green-600 text-white rounded-md disabled:bg-green-300"
        >
          {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 mb-6 rounded">
          {error}
        </div>
      )}

      {transcription && (
        <div className="bg-gray-50 p-6 rounded-md border">
          <h2 className="text-xl font-semibold mb-3">Transcription Results</h2>
          <p className="mb-4">{transcription.text}</p>

          {transcription.words && transcription.words.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Word Timestamps</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Word</th>
                      <th className="px-4 py-2 text-left">Start</th>
                      <th className="px-4 py-2 text-left">End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcription.words.map((word: any, index: number) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                      >
                        <td className="px-4 py-2">{word.word}</td>
                        <td className="px-4 py-2">{word.start.toFixed(2)}s</td>
                        <td className="px-4 py-2">{word.end.toFixed(2)}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
