'use client';

import { Note } from '@/server/db/schema/types';

import { MoreHorizontalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteNote } from '@/server/actions/notes';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';

export function NoteCardActions({ note }: { note: Note }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { execute, isExecuting } = useAction(deleteNote, {
    onSuccess: () => {
      toast.success('Note deleted');
      setOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });
  const handleDelete = async () => {
    execute({ id: note.id });
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer">
          <MoreHorizontalIcon className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isExecuting}
          >
            {isExecuting ? 'Deleting...' : 'Delete Note'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
