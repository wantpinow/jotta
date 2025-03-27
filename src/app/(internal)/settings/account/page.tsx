import { Button } from '@/components/ui/button';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardSubtitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth/validate';
import { UserNameForm } from '@/app/(internal)/settings/account/_components/name-form';
import { DeleteAccountDialog } from '@/app/(internal)/settings/account/_components/delete-account';
import { signOut } from '@/lib/auth/actions';
import { UserAvatar } from '@/components/misc/user-avatar';
import { UserImageForm } from '@/app/(internal)/settings/account/_components/image-form';

export default async function SettingsAccountPage() {
  const { user } = await auth();
  if (!user) {
    return null;
  }
  return (
    <>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        <div className="pb-4 space-y-6">
          <UserImageForm user={user}>
            <div className="flex gap-4 items-center w-fit">
              <UserAvatar user={user} size={56} className="flex-none" />
              <Button size="sm">Change Photo</Button>
            </div>
          </UserImageForm>
          <UserNameForm user={user} />
        </div>
        <div className="space-y-4 py-4">
          <CardSubtitle>Sign Out</CardSubtitle>
          <Button size="sm" variant="outline" onClick={signOut}>
            Sign Out
          </Button>
        </div>
        <div className="space-y-4 py-4">
          <CardSubtitle>Danger Zone</CardSubtitle>
          <DeleteAccountDialog>
            <Button size="sm" variant="destructive">
              Delete Account
            </Button>
          </DeleteAccountDialog>
        </div>
      </CardContent>
    </>
  );
}
