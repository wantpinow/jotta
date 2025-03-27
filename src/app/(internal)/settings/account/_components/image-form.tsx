'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAction } from 'next-safe-action/hooks';
import { updateUserImage } from '@/server/actions/users/actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UserAvatar } from '@/components/misc/user-avatar';
import { User } from 'lucia';

export function UserImageForm({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const { execute, isExecuting } = useAction(updateUserImage, {
    onSuccess: () => {
      toast.success('Profile image updated');
      setIsOpen(false);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error?.error?.serverError || 'Failed to update profile image');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute({ imageUrl });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Photo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center py-4">
            <UserAvatar
              user={{ ...user, image: imageUrl || user.image }}
              size={100}
              className="flex-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-sm text-muted-foreground">
              Enter a URL to an image on the web. For best results, use a square image.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isExecuting || !imageUrl}>
              {isExecuting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
