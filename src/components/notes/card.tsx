import { Clock, User } from 'lucide-react';
import { NoteWithMentions, PersonNoteMentionWithPerson } from '@/server/db/schema/types';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { NoteCardActions } from '@/components/notes/card-actions';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function processHtmlContent(html: string): string {
  // remove @ from mentions
  return html.replace(
    /<span class="mention"[^>]*>@([^<]+)<\/span>/g,
    '<span class="mention" $1>$1</span>',
  );
}

const getMentionsFirstNamesMap = (
  mentions: PersonNoteMentionWithPerson[],
): Record<string, string> => {
  // create a map of personId to first name.
  // if there are multiple people with the same first name, use the full name.
  const mentionsFirstNamesMap: Record<string, string> = {};

  const firstNameCount: Record<string, number> = {};
  const mentionsByFirstName: Record<
    string,
    Array<{ personId: string; name: string; firstName: string }>
  > = {};

  // First, count occurrences of each first name
  mentions.forEach((mention) => {
    const fullName = mention.person.name;
    const firstName = fullName.split(' ')[0];
    const firstNameLower = firstName.toLowerCase();

    firstNameCount[firstNameLower] = (firstNameCount[firstNameLower] || 0) + 1;

    if (!mentionsByFirstName[firstNameLower]) {
      mentionsByFirstName[firstNameLower] = [];
    }
    mentionsByFirstName[firstNameLower].push({
      personId: mention.personId,
      name: fullName,
      firstName: firstName,
    });
  });

  // Then create the map using first name where unique, full name where duplicated
  Object.entries(mentionsByFirstName).forEach(([firstNameLower, mentions]) => {
    if (firstNameCount[firstNameLower] === 1) {
      // Unique first name - use just the first name (with original capitalization)
      mentions.forEach((mention) => {
        mentionsFirstNamesMap[mention.personId] = mention.firstName;
      });
    } else {
      // Duplicate first name - use full names
      mentions.forEach((mention) => {
        mentionsFirstNamesMap[mention.personId] = mention.name;
      });
    }
  });

  // uppercase the first letter of each first name
  Object.keys(mentionsFirstNamesMap).forEach((personId) => {
    mentionsFirstNamesMap[personId] =
      mentionsFirstNamesMap[personId].charAt(0).toUpperCase() +
      mentionsFirstNamesMap[personId].slice(1);
  });

  return mentionsFirstNamesMap;
};

export function NoteCard({ note }: { note: NoteWithMentions }) {
  const mentionsFirstNamesMap = getMentionsFirstNamesMap(note.mentions);

  const processedContent = processHtmlContent(note.content);

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <p className="flex-none text-[13px] font-semibold text-muted-foreground flex gap-1.5 items-center whitespace-nowrap overflow-hidden text-ellipsis">
              <Clock size={12} />
              {format(note.updatedAt, 'HH:mm a')}
            </p>
            {note.mentions.slice(0, 2).map((mention) => (
              <Link
                key={mention.personId}
                href={`/people/${mention.personId}`}
                className="hover:opacity-70 transition-opacity duration-100 whitespace-nowrap bg-primary/10 text-primary rounded px-1.5 py-[0.15rem] text-xs font-semibold flex gap-1 items-center"
              >
                <User className="fill-primary flex-none" size={12} />
                {mentionsFirstNamesMap[mention.personId] ?? mention.person.name}
              </Link>
            ))}
            {note.mentions.length > 2 && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer text-[13px] text-muted-foreground">
                    +{note.mentions.length - 2} more
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {note.mentions.slice(2).map((mention) => (
                    <DropdownMenuItem key={mention.personId} asChild>
                      <Link href={`/people/${mention.personId}`}>
                        <User className="fill-muted-foreground flex-none" size={12} />
                        {mentionsFirstNamesMap[mention.personId] ?? mention.person.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <NoteCardActions note={note} />
        </div>
        <div
          className="ProseMirror border-t pt-3"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </CardContent>
    </Card>
  );
}

export function NoteCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3">
        <Skeleton className="w-1/3 h-4" />
        <Skeleton className="w-full h-12" />
      </CardContent>
    </Card>
  );
}
