import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/validate';

export default async function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await auth();
  if (!session) {
    redirect('/');
  }
  return children;
}
