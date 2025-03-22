'use server';

// Server action for transcription
export async function transcribeAudio(formData: FormData) {
  const file = formData.get('audio') as File;
  if (!file) {
    throw new Error('No audio file provided');
  }

  const formDataForAPI = new FormData();
  formDataForAPI.append('file', file);
  formDataForAPI.append('model', 'whisper-1');
  formDataForAPI.append('response_format', 'verbose_json');
  formDataForAPI.append('timestamp_granularities', 'word');

  // Use environment variable for API key
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: formDataForAPI,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Transcription failed: ${error}`);
  }

  return response.json();
}
