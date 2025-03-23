import { Brain } from 'lucide-react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth/validate';
import { cn } from '@/lib/utils';
import { GradientBubble } from '@/components/misc/gradient-bubble';

export async function TopNav({ className }: { className?: string }) {
  const { user } = await auth();
  return (
    <nav
      className={cn('border-b border-primary/15 bg-background w-full z-50', className)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href={user ? '/home' : '/'} className="flex items-center gap-2">
              <Brain className="text-primary" size={24} />
              <span className="text-xl font-semibold text-primary">Jotta</span>
            </Link>
            <div className="h-9 bg-muted w-[2px]" />
            <Link
              href="/home"
              className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
            >
              Notes
            </Link>
            <Link
              href="/people"
              className="text-sm text-muted-foreground hover:text-primary cursor-pointer"
            >
              People
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </Button>
                {/* <Link href="/profile" className="bg-red-500 size-7 rounded-full"></Link> */}
                <GradientBubble
                  seed={user.id}
                  size={32}
                  className="border border-border shadow-xs cursor-pointer hover:opacity-80 transition-opacity duration-100 rounded-full"
                  asChild
                >
                  <Link href="/profile"></Link>
                </GradientBubble>
              </>
            ) : (
              <Button
                variant="ghost"
                className="hover:bg-transparent text-muted-foreground"
                asChild
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
