import { SignInEmailForm } from '@/app/(auth)/sign-in/email/_components/sign-in-email-form';

export default async function SignInEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect?: string;
  }>;
}) {
  const { redirect } = await searchParams;
  return <SignInEmailForm redirect={redirect} />;
}
