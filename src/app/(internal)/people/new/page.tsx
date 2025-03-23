import { PageHeader } from '@/components/page/header';
import { Card, CardContent } from '@/components/ui/card';
import { NewPersonForm } from '@/components/people/new-person-form';

export default async function NewPersonPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Person" description="Add someone to your Rolodex" />
      <div className="space-y-3">
        <Card>
          <CardContent className="space-y-3">
            <NewPersonForm redirectTo="/people" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
