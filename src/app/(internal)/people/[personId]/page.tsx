import { PageHeader } from '@/components/page/header';
import { getPerson } from '@/server/actions/person';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

export default async function PersonPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const person = await getPerson({ id: personId });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <PageHeader
          title={person.name}
          description={`Added on ${format(person.createdAt, 'MMMM d, yyyy')}`}
        />
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href={`/people/${person.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Person
          </Link>
        </Button>
      </div>

      <div
        className="ProseMirror bg-card p-4 rounded-md shadow-sm"
        dangerouslySetInnerHTML={{ __html: person.description || '' }}
      />
    </div>
  );
}
