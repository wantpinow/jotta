import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-12">
      <div className="mx-auto max-w-md space-y-2">
        <Card className="gap-y-4">
          <CardHeader>
            <CardTitle>Welcome to Jotta</CardTitle>
            <CardDescription className="border-b pb-4">
              Thanks for visiting!
            </CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        <CardDescription className="text-right text-xs">
          built with ❤️ by{' '}
          <Link
            href="https://github.com/wantpinow/jotta"
            className="underline"
            target="_blank"
          >
            wantpinow
          </Link>
        </CardDescription>
      </div>
    </div>
  );
}
