import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AudioLines, Circle, Loader2, Mic } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AudioRecorder({
  audioFiles,
  setAudioFiles,
  onUpdate,
  isTranscribing = false,
}: {
  audioFiles: File[];
  setAudioFiles: (files: File[]) => void;
  onUpdate?: (audioFile: File) => void;
  isTranscribing?: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioMimeType, setAudioMimeType] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const audioChunksRef = useRef<Blob[]>([]);

  const getBestSupportedMimeType = () => {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    const ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
      return 'audio/mp4';
    } else if (ua.indexOf('firefox') !== -1) {
      return 'audio/ogg';
    } else {
      return 'audio/webm';
    }
  };
  const getFileExtension = (mimeType: string) => {
    if (mimeType.includes('mp4')) {
      return 'm4a';
    } else if (mimeType.includes('ogg')) {
      return 'ogg';
    } else if (mimeType.includes('wav')) {
      return 'wav';
    } else {
      return 'webm';
    }
  };

  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const bestMimeType = getBestSupportedMimeType();
      setAudioMimeType(bestMimeType);
      const mediaRecorder = new MediaRecorder(stream, { mimeType: bestMimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: audioMimeType ?? 'audio/mpeg',
        });
        const audioFile = new File(
          [audioBlob],
          `audio.${getFileExtension(audioMimeType ?? 'audio/mpeg')}`,
          {
            type: audioMimeType ?? 'audio/mpeg',
          },
        );
        setAudioFiles([...audioFiles, audioFile]);
        if (onUpdate) {
          onUpdate(audioFile);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      interval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
      return () => {
        if (interval.current) {
          clearInterval(interval.current);
        }
      };
    } catch {
      toast.error(
        'Error accessing microphone. Please ensure you have granted permission.',
      );
    }
  };

  const interval = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setRecordingDuration(0);
      if (interval.current) {
        clearInterval(interval.current);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" type="button" size="icon" className="relative">
            <AudioLines size={12} />
            {audioFiles.length > 0 && (
              <span className="absolute text-[0.625rem] top-0 right-0 bg-foreground text-background rounded-full w-4 h-4 flex items-center justify-center">
                {isTranscribing ? (
                  <div className="transform scale-[0.8]">
                    <Loader2 className="animate-spin duration-1000" />
                  </div>
                ) : (
                  audioFiles.length
                )}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader className="mb-2">
            <DialogTitle>Audio Recordings</DialogTitle>
            <DialogDescription>
              {audioFiles.length} Audio Recording{audioFiles.length === 1 ? '' : 's'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {audioFiles.map((file, index) => (
              <audio
                key={index}
                src={URL.createObjectURL(file)}
                controls
                className="w-full"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
      {isRecording ? (
        <Button variant="accent" type="button" size="icon" onClick={stopRecording}>
          <Circle className="fill-destructive text-destructive" size={12} />
        </Button>
      ) : (
        <Button variant="ghost" type="button" size="icon" onClick={startRecording}>
          <Mic size={12} />
        </Button>
      )}
      {isRecording && (
        <p className="text-sm text-muted-foreground">
          Recording:{' '}
          {Math.floor(recordingDuration / 60)
            .toString()
            .padStart(2, '0')}
          :{(recordingDuration % 60).toString().padStart(2, '0')}
        </p>
      )}
    </div>
  );
}
