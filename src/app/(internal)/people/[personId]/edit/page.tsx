import { PageHeader } from '@/components/page/header';
import { getPerson } from '@/server/actions/person';
import { Card, CardContent } from '@/components/ui/card';
import { EditPersonForm } from '@/components/people/edit-person-form';

export default async function EditPersonPage({
  params,
}: {
  params: Promise<{ personId: string }>;
}) {
  const { personId } = await params;
  const person = (await getPerson({ id: personId }))?.data;
  if (!person) {
    return <div>Person not found</div>;
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
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
