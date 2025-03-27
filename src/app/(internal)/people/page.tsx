import { PageHeader } from '@/components/page/header';
import { UserIcon, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import {
  PeopleList,
  PeopleListSkeleton,
} from '@/app/(internal)/people/_components/people-list';

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="People" description="Manage your Rolodex" />
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/people/new">
            <UserIcon />
            New Person
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/me">
            <Bot />
            <span>
              <span className="text-primary">Auto</span> Biography
            </span>
          </Link>
        </Button>
      </div>
      <div className="space-y-3">
        <Suspense fallback={<PeopleListSkeleton />}>
          <PeopleList />
        </Suspense>
      </div>
    </div>
  );
}
