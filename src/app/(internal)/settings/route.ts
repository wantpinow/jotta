import { redirect } from 'next/navigation';

export async function GET(): Promise<Response> {
  redirect('/settings/account');
}
