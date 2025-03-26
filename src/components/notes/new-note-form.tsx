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
import { useState } from 'react';
import { AudioRecorder } from '@/components/misc/audio-recorder';
import { transcribeAudioFile } from '@/server/actions/transcribe';
import { useAction } from 'next-safe-action/hooks';

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

  const { execute: executeCreateNote, isExecuting: isCreatingNote } = useAction(
    createNote,
    {
      onSuccess: ({ data }) => {
        if (!data) {
          toast.error('Failed to save note');
          return;
        }
        toast.success('Note saved');
        if (redirectTo) {
          router.push(redirectTo);
        } else {
          router.push(`/notes/${data?.id}`);
        }
      },
      onError: (error) => {
        toast.error(error.error.serverError);
      },
    },
  );
  const onSubmitForm = (values: z.infer<typeof newNoteFormSchema>) => {
    executeCreateNote({
      content: values.content,
      mentions: values.mentions.map((mention) => ({
        personId: mention.id,
        noteId: mention.id,
      })),
    });
  };

  const { execute: executeTranscribe, isExecuting: isTranscribing } = useAction(
    transcribeAudioFile,
    {
      onSuccess: ({ data: transcription }) => {
        if (!transcription) return;
        const currentContent = form.getValues('content');
        const updatedContent = isFilledHtml(currentContent)
          ? `${currentContent}<p>${transcription}</p>`
          : `<p>${transcription}</p>`;
        form.setValue('content', updatedContent, { shouldValidate: true });
        toast.success('Audio transcription added.');
      },
      onError: (error) => {
        toast.error(error.error.serverError);
      },
    },
  );

  const handleAudioUpdate = async (audioFile: File) => {
    executeTranscribe({ file: audioFile });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-3">
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
              disabled={isCreatingNote || isTranscribing}
            >
              {isCreatingNote || isTranscribing ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
