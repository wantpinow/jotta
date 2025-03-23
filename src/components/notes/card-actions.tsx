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
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export function NoteCardActions({ note }: { note: Note }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, startTransition] = useTransition();
  const handleDelete = async () => {
    startTransition(async () => {
      await deleteNote({ id: note.id });
      toast.success('Note deleted');
      setOpen(false);
      router.refresh();
    });
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
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Note'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
