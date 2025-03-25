'use server';

import { auth } from '@/lib/auth/validate';
import OpenAI from 'openai';
const openai = new OpenAI();

export async function transcribeAudioFile(file: File) {
  const { user } = await auth();
  if (!user) {
    throw new Error('Unauthorized');
  }

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    // model: 'gpt-4o-transcribe',
    model: 'whisper-1',
    prompt: 'You are a helpful assistant that transcribes audio files into clean text.',
  });
  return transcription.text;
}
