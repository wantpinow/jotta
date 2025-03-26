import { Brain } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth/validate';
import { cn } from '@/lib/utils';
import { GradientBubble } from '@/components/misc/gradient-bubble';
import { TopNavLinks } from '@/components/nav/topnav-links';
import NotificationsPopover from '@/components/nav/notifications-popover';

export async function TopNav({ className }: { className?: string }) {
  const { user } = await auth();
  return (
    <nav
      className={cn('border-b border-primary/15 bg-background w-full z-50', className)}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link
              href={user ? '/home' : '/'}
              className="flex items-center gap-2 text-primary dark:text-foreground"
            >
              <Brain size={24} />
              <span className="text-xl font-semibold tracking-wider">Jotta</span>
            </Link>
            <div className="h-9 bg-muted w-[2px]" />
            {user && <TopNavLinks />}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationsPopover />
                <GradientBubble
                  seed={user.id}
                  size={32}
                  className="border border-border dark:border-0 shadow-xs cursor-pointer hover:opacity-80 transition-opacity duration-100 rounded-full"
                  asChild
                >
                  <Link href="/settings"></Link>
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
