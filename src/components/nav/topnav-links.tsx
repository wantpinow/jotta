'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
export function TopNavLinks() {
  const pathname = usePathname();
  const links = [
    {
      href: '/home',
      label: 'Notes',
    },
    {
      href: '/people',
      label: 'People',
    },
    {
      href: '/activities',
      label: 'Activities',
    },
  ];
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'text-sm text-muted-foreground hover:text-primary dark:text-muted-foreground dark:hover:text-foreground cursor-pointer',
            pathname === link.href && 'text-primary dark:text-foreground',
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}
