'use client';

import { Person } from '@/server/db/schema/types';

import { MoreHorizontalIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deletePerson } from '@/server/actions/person';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAction } from 'next-safe-action/hooks';

export function PersonCardActions({ person }: { person: Person }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { execute, isExecuting } = useAction(deletePerson, {
    onSuccess: () => {
      toast.success('Person deleted');
      setOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.error.serverError);
    },
  });
  const handleDelete = async () => {
    execute({ id: person.id });
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
            asChild
            onClick={(e) => {
              e.preventDefault();
              router.push(`/people/${person.id}`);
              setOpen(false);
            }}
          >
            <div>View Details</div>
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isExecuting}
          >
            {isExecuting ? 'Deleting...' : 'Delete Person'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
