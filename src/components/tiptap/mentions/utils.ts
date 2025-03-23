import { JSONContent } from '@tiptap/react';
import { MentionSuggestion } from '@/components/tiptap/mentions/mentionSuggestionOptions';

export const getMentionsFromJSON = (json: JSONContent) => {
  const allMentions: MentionSuggestion[] = [];
  _getMentionsFromJSON(json, allMentions);
  const uniqueMentions = Array.from(
    new Map(allMentions.map((mention) => [mention.id, mention])).values(),
  );
  return uniqueMentions;
};

const _getMentionsFromJSON = (json: JSONContent, mentions: MentionSuggestion[]) => {
  if (json.type === 'mention' && json.attrs?.id && json.attrs?.label) {
    mentions.push({ id: json.attrs.id, name: json.attrs.label });
  }
  if (json.content) {
    json.content.forEach((node) => _getMentionsFromJSON(node, mentions));
  }
  return mentions;
};
