import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/components/page/header';

export default async function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Activities" description="Manage your Activities" />
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/notes/new">
            <PlusIcon />
            Add Activity
          </Link>
        </Button>
      </div>
      <div className="space-y-3"></div>
    </div>
  );
}
