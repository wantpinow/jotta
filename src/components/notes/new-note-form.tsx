'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Editor } from '@/components/tiptap/editor';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { isFilledHtml } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { createNote } from '@/server/actions/notes';
import { useState, useTransition } from 'react';
import { AudioRecorder } from '../misc/audio-recorder';
import { transcribeAudioFile } from '@/server/actions/transcribe';

const newNoteFormSchema = z.object({
  content: z.string().min(1, { message: 'Note cannot be empty' }).refine(isFilledHtml, {
    message: 'Note cannot be empty',
  }),
  mentions: z.array(z.object({ id: z.string(), name: z.string() })),
});

export function NewNoteForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof newNoteFormSchema>>({
    resolver: zodResolver(newNoteFormSchema),
    defaultValues: {
      content: '',
      mentions: [],
    },
  });
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [isSaving, startSaving] = useTransition();
  const onSubmit = (data: z.infer<typeof newNoteFormSchema>) => {
    startSaving(async () => {
      if (!isFilledHtml(data.content)) {
        toast.error('Note cannot be empty');
        return;
      }
      const note = await createNote({ content: data.content, mentions: data.mentions });
      toast.success('Note saved');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/notes/${note.id}`);
      }
    });
  };

  const [isTranscribing, startTranscribing] = useTransition();
  const handleAudioUpdate = async (audioFile: File) => {
    startTranscribing(async () => {
      try {
        // Call the transcribe action
        const transcription = await transcribeAudioFile(audioFile);

        // Update the editor content with the transcription
        const currentContent = form.getValues('content');
        const updatedContent = isFilledHtml(currentContent)
          ? `${currentContent}<p>${transcription}</p>`
          : `<p>${transcription}</p>`;

        form.setValue('content', updatedContent, { shouldValidate: true });
        toast.success('Audio transcription added.');
      } catch (error) {
        console.error('Transcription error:', error);
        toast.error('Failed to transcribe audio');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Editor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write your note here..."
                  showToolbar={false}
                  className="p-0 bg-muted/50 rounded-md"
                  peopleMentions={true}
                  onMentionsChange={(mentions) => {
                    form.setValue('mentions', mentions);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-2">
          <div className="flex gap-2">
            <AudioRecorder
              audioFiles={audioFiles}
              setAudioFiles={setAudioFiles}
              onUpdate={handleAudioUpdate}
              isTranscribing={isTranscribing}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" type="button">
              Reset
            </Button>
            <Button
              type="submit"
              variant={form.formState.isValid ? 'default' : 'outline'}
              disabled={isSaving || isTranscribing}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
