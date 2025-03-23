'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { generateSession } from '@/app/testing/realtime/_actions/transcribe';
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
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [error, setError] = useState<string>('');

  const startRecording = async () => {
    try {
      // Create a peer connection
      peerConnection.current = new RTCPeerConnection();

      // Set up audio element for playback
      if (!audioElement.current) {
        audioElement.current = new Audio();
        audioElement.current.autoplay = true;
      }

      // Handle incoming audio tracks
      peerConnection.current.ontrack = (event) => {
        if (audioElement.current) {
          audioElement.current.srcObject = event.streams[0];
        }
        console.log('Received remote track:', event);
      };

      // Get user microphone
      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Add local audio track to the connection
      mediaStream.current.getTracks().forEach((track) => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, mediaStream.current!);
        }
      });

      // Set up data channel for communication
      dataChannel.current = peerConnection.current.createDataChannel('oai-events');
      dataChannel.current.addEventListener('message', (event) => {
        console.log('Message from server:', event.data);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'transcript' && data.text) {
            setTranscription((prev) => prev + ' ' + data.text);
          }
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      });

      // Create and set local description (offer)
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      // Connect to OpenAI realtime API
      const baseUrl = 'https://api.openai.com/v1/realtime';
      const model = 'gpt-4o-realtime-preview-2024-12-17';

      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`API request failed: ${sdpResponse.status}`);
      }

      const sdpAnswer = await sdpResponse.text();
      const answer = {
        type: 'answer' as RTCSdpType,
        sdp: sdpAnswer,
      };

      await peerConnection.current.setRemoteDescription(answer);
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(`Recording failed: ${err instanceof Error ? err.message : String(err)}`);
      stopRecording();
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }

    if (dataChannel.current) {
      dataChannel.current.close();
      dataChannel.current = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    setIsRecording(false);
  }, [mediaStream, dataChannel, peerConnection, setIsRecording]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isRecording, stopRecording]);

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
        <Button
          variant="outline"
          onClick={() => setTranscription('')}
          disabled={!transcription}
        >
          Clear Transcript
        </Button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="p-4 border rounded-md min-h-[200px] bg-white">
        <h2 className="font-medium mb-2">Transcription:</h2>
        <div className="whitespace-pre-wrap">
          {transcription || 'Transcription will appear here...'}
        </div>
      </div>
    </div>
  );
}
