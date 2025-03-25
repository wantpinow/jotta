'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DatabaseUserAttributes } from '@/lib/auth';
import { deleteUser } from '@/server/actions/user';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function DeleteAccountDialog({
  children,
  user,
}: {
  children: React.ReactNode;
  user: DatabaseUserAttributes;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isDeleting, startDelete] = useTransition();

  const handleDelete = async () => {
    toast.success('Success');
    startDelete(async () => {
      await deleteUser();
      router.push('/');
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              if (isDeleting) {
                return;
              }
              handleDelete();
            }}
          >
            {isDeleting ? 'Deleting account...' : 'Delete my account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
