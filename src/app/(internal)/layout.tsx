import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/validate';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserOnboardingForm } from '@/app/(internal)/_components/user-onboarding-form';

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await auth();
  if (!user) {
    redirect('/');
  }

  const userFieldsToCheck = ['firstName', 'lastName'] as const;
  const userHasRequiredFields = userFieldsToCheck.every((field) => user[field]);
  if (userHasRequiredFields) {
    return <div className="py-6 max-w-3xl mx-auto space-y-6">{children}</div>;
  }

  return (
    <Dialog open>
      <DialogContent closeButton={false}>
        <DialogHeader>
          <DialogTitle>Welcome to Jotta!</DialogTitle>
          <DialogDescription>Please complete your profile to continue.</DialogDescription>
        </DialogHeader>
        <UserOnboardingForm user={user} />
      </DialogContent>
    </Dialog>
  );
}
