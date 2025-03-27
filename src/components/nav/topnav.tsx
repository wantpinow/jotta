import { Bell, Brain } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth/validate';
import { cn } from '@/lib/utils';
import { TopNavLinks } from '@/components/nav/topnav-links';
import NotificationsPopover from '@/components/nav/notifications-popover';
import { UserAvatar } from '@/components/misc/user-avatar';
import { getUserNotifications } from '@/server/actions/notifications/actions';
import { UserNotification } from '@/server/db/schema/types';
import { Suspense } from 'react';
export async function TopNav({ className }: { className?: string }) {
  const { user } = await auth();
  const getNotifications = async (): Promise<UserNotification[]> => {
    const res = await getUserNotifications({ limit: 5 });
    return res?.data ?? [];
  };
  const notificationsPromise = getNotifications();
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
          <div className="flex items-center space-x-8">
            {user ? (
              <>
                <Suspense
                  fallback={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative hover:bg-transparent cursor-default"
                      aria-label="Notifications"
                    >
                      <Bell className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  }
                >
                  <NotificationsPopover notificationsPromise={notificationsPromise} />
                </Suspense>
                <UserAvatar
                  user={user}
                  size={32}
                  className="border border-border dark:border-0 shadow-xs hover:opacity-80 transition-opacity duration-100 rounded-full"
                  linkHref="/settings"
                />
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
