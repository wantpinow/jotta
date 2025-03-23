import { PersonCard, PersonCardSkeleton } from '@/components/people/card';
import { getPeople } from '@/server/actions/person';

export async function PeopleList() {
  const people = await getPeople();
  return (
    <div className="space-y-3">
      {people.map((person) => (
        <PersonCard key={person.id} person={person} />
      ))}
      {people.length === 0 && (
        <div className="text-center bg-background rounded-md p-4 border flex flex-col items-center justify-center gap-2 h-32">
          <p className="text-sm text-muted-foreground">No people added yet</p>
        </div>
      )}
    </div>
  );
}

export function PeopleListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <PersonCardSkeleton key={index} />
      ))}
    </div>
  );
}
