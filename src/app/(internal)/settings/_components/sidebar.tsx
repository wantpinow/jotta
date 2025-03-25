'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SettingsSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const links = [
    {
      href: '/settings/account',
      label: 'Account',
    },
    {
      href: '/settings/privacy',
      label: 'Privacy',
    },
    {
      href: '/settings/notifications',
      label: 'Notifications',
    },
    {
      href: '/settings/billing',
      label: 'Billing',
    },
    {
      href: '/settings/integrations',
      label: 'Integrations',
    },
  ];

  return (
    <Card className={cn('w-full py-2.5', className)}>
      <CardContent className="px-3 space-y-2">
        {links.map((link) => (
          <Button
            variant={pathname === link.href ? 'accent' : 'ghost'}
            asChild
            key={link.href}
            className="w-full justify-start"
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
