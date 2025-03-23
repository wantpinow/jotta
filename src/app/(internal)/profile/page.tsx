import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth/actions';

export default async function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>
      <Button onClick={signOut}>Sign out</Button>
    </div>
  );
}
