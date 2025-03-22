'use server';

import { serverEnv } from '@/env/server';

export async function generateSession() {
  const r = await fetch('https://api.openai.com/v1/realtime/transcription_sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serverEnv.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input_audio_format: 'pcm16', // For pcm16, input audio must be 16-bit PCM at a 24kHz sample rate, single channel (mono), and little-endian byte order.
      input_audio_transcription: {
        language: 'en',
        // model: 'gpt-4o-transcribe',
        model: 'whisper-1',
      },
      input_audio_noise_reduction: {
        type: 'far_field',
      },
    }),
  });

  const data = await r.json();

  return data;
}
