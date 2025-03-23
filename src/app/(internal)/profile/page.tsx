import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/actions';
import { auth } from '@/lib/auth/validate';

export default async function ProfilePage() {
  const { user } = await auth();
  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>Profile</h1>
      <Button onClick={signOut}>Sign out</Button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
