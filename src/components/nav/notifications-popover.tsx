'use client';

import { use, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { UserNotification } from '@/server/db/schema/types';
import { NOTIFICATION_DESCRIPTIONS } from '@/lib/notifications';
import { readNotification } from '@/server/actions/notifications/actions';
import { useAction } from 'next-safe-action/hooks';

export default function NotificationsPopover({
  notificationsPromise,
}: {
  notificationsPromise: Promise<UserNotification[]>;
}) {
  const notifications = use(notificationsPromise);
  const [open, setOpen] = useState(false);
  const { execute: markAsRead } = useAction(readNotification);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-transparent"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notifications.length > 0 && (
            <span
              className={cn(
                'absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary transition-all',
                open ? 'opacity-0' : 'opacity-100',
              )}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-clip" align="end">
        <div className="flex flex-col">
          <div className="border-b px-4 py-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              Notifications
              {notifications.length > 0 && (
                <span className="text-[0.625rem] bg-primary size-4.5 flex items-center justify-center rounded-full text-primary-foreground">
                  {notifications.length}
                </span>
              )}
            </h3>
          </div>

          {notifications.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => {
                const notificationConfig = NOTIFICATION_DESCRIPTIONS[notification.type];
                const NotificationIcon = notificationConfig.icon;
                const bgColor = notificationConfig.bgColor;
                const iconColor = notificationConfig.iconColor;
                return (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                    onClick={() => markAsRead({ notificationId: notification.id })}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                        bgColor,
                      )}
                    >
                      {NotificationIcon && (
                        <NotificationIcon className={cn('h-4 w-4', iconColor)} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{notificationConfig.title}</h4>
                      {notification.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium">No notifications</h4>
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;re all caught up! We&apos;ll notify you when something new
                arrives.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
