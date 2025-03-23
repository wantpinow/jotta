import { PageHeader } from '@/components/page/header';
import { getPerson } from '@/server/actions/person';
import { Card, CardContent } from '@/components/ui/card';
import { EditPersonForm } from '@/components/people/edit-person-form';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const person = await getPerson({ id: personId });
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/people/${person.id}`} className="flex-none">
          <ArrowLeft size={32} />
        </Link>
        <PageHeader title={`Edit ${person.name}`} description="Update person details" />
      </div>
      <div className="space-y-3">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <EditPersonForm person={person} redirectTo={`/people/${person.id}`} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
