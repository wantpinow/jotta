'use server';

import OpenAI from 'openai';
import { z } from 'zod';
import { authenticatedAction } from '@/server/actions/safe-action';

const openai = new OpenAI();

export const transcribeAudioFile = authenticatedAction
  .schema(z.object({ file: z.instanceof(File) }))
  .action(async ({ parsedInput: { file } }) => {
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      prompt: 'You are a helpful assistant that transcribes audio files into clean text.',
    });
    return transcription.text;
  });
