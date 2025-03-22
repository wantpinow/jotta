'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateSession } from './_actions/transcribe';
import { Button } from '@/components/ui/button';

export default function TranscribeRealtimePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const getSession = async () => {
    const session = await generateSession();
    setSession(session);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Realtime Transcription</h1>

      {!session ? (
        <div className="space-y-4">
          <p>Welcome to the realtime transcription page.</p>
          <Button onClick={getSession}>Generate Session</Button>
        </div>
      ) : (
        <RealtimeTranscription
          ephemeralKey={session.client_secret.value}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      )}

      {session && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-sm font-medium mb-2">Session Info:</h3>
          <pre className="text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function RealtimeTranscription({
  ephemeralKey,
  isRecording,
  setIsRecording,
}: {
  ephemeralKey: string;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
}) {
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [websocketIsConnected, setWebsocketIsConnected] = useState(false);
  const [transcription, setTranscription] = useState<string>('');

  const startRecording = () => {
    console.log('start recording');
    setIsRecording(true);
    const ws = new WebSocket('wss://api.openai.com/v1/realtime?intent=transcription', [
      'realtime',
      // Auth
      'openai-insecure-api-key.' + ephemeralKey,
      // Beta protocol, required
      'openai-beta.realtime-v1',
    ]);
    setWebsocket(ws);
    ws.onopen = function open() {
      setWebsocketIsConnected(true);
    };

    ws.onmessage = function incoming(message) {
      try {
        const data = JSON.parse(message.data);
        if (data.type === 'conversation.item.input_audio_transcription.delta') {
          setTranscription((prev) => prev + (data.delta || ''));
        }
        console.log('Received:', data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };
  };

  const stopRecording = useCallback(() => {
    console.log('stop recording');
    setIsRecording(false);
    // close websocket
    websocket?.close();
    setWebsocketIsConnected(false);
  }, [websocket, setIsRecording, setWebsocketIsConnected]);

  useEffect(() => {
    if (websocketIsConnected) {
      // start recording
      console.log('start recording');

      let audioContext: AudioContext | null = null;
      let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
      let processor: ScriptProcessorNode | null = null;

      navigator.mediaDevices
        .getUserMedia({
          audio: {
            sampleRate: 24000,
            channelCount: 1,
            echoCancellation: true,
            autoGainControl: true,
            noiseSuppression: true,
          },
        })
        .then((stream) => {
          // Create audio context with the desired sample rate
          audioContext = new AudioContext({ sampleRate: 24000 });
          mediaStreamSource = audioContext.createMediaStreamSource(stream);

          // Create script processor for raw PCM access
          processor = audioContext.createScriptProcessor(4096, 1, 1);

          processor.onaudioprocess = (e) => {
            if (websocket?.readyState === WebSocket.OPEN) {
              // Get raw PCM data
              const inputData = e.inputBuffer.getChannelData(0);

              // Convert Float32Array to Int16Array (PCM16)
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                // Convert float to int16
                pcmData[i] = Math.max(
                  -32768,
                  Math.min(32767, Math.floor(inputData[i] * 32768)),
                );
              }

              // Convert to base64
              const base64Audio = btoa(
                String.fromCharCode(...new Uint8Array(pcmData.buffer)),
              );

              // Send data
              const message = {
                type: 'input_audio_buffer.append',
                audio: base64Audio,
              };
              websocket.send(JSON.stringify(message));
            }
          };

          // Connect nodes: source -> processor -> destination
          mediaStreamSource.connect(processor);
          processor.connect(audioContext.destination);

          // Set up cleanup
          websocket?.addEventListener('close', () => {
            if (processor && mediaStreamSource && audioContext) {
              processor.disconnect();
              mediaStreamSource.disconnect();
              stream.getTracks().forEach((track) => track.stop());
            }
          });
        })
        .catch((err) => {
          console.error('Failed to get microphone access:', err);
        });

      return () => {
        // Cleanup function
        if (processor && mediaStreamSource && audioContext) {
          processor.disconnect();
          mediaStreamSource.disconnect();
        }
      };
    }
  }, [websocketIsConnected, isRecording, stopRecording, websocket]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {!isRecording ? (
          <Button onClick={startRecording}>Start Recording</Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording}>
            Stop Recording
          </Button>
        )}
      </div>
      {websocketIsConnected ? (
        <div>Connected to server</div>
      ) : (
        <div>Not connected to server</div>
      )}

      <div className="p-4 border rounded-md min-h-[200px] bg-white">
        <h2 className="font-medium mb-2">Transcription:</h2>
        <div className="whitespace-pre-wrap">
          {transcription || 'Transcription will appear here...'}
        </div>
      </div>
    </div>
  );
}
