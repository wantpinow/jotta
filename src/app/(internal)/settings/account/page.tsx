import { GradientBubble } from '@/components/misc/gradient-bubble';
import { Button } from '@/components/ui/button';
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardSubtitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth/validate';
import { UserNameForm } from './_components/name-form';
import { DeleteAccountDialog } from './_components/delete-account';

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
          <div className="flex gap-4 items-center">
            <GradientBubble seed={user.id} className="flex-none" size={52} />
            <Button size="sm">Change Photo</Button>
          </div>
          <UserNameForm user={user} />
        </div>
        <div className="space-y-4 py-4">
          <CardSubtitle>Danger Zone</CardSubtitle>
          <DeleteAccountDialog user={user}>
            <Button size="sm" variant="outline">
              Delete Account
            </Button>
          </DeleteAccountDialog>
        </div>
      </CardContent>
    </>
  );
}
