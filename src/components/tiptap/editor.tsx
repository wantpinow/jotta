'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Heading from '@tiptap/extension-heading';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react';
import Mention from '@tiptap/extension-mention';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

import { useEffect } from 'react';
import {
  MentionSuggestion,
  mentionSuggestionOptions,
} from '@/components/tiptap/mentions/mentionSuggestionOptions';
import { getMentionsFromJSON } from '@/components/tiptap/mentions/utils';

export function Editor({
  content,
  onChange,
  placeholder = 'Start writing...',
  showToolbar = true,
  className,
  peopleMentions = false,
  onMentionsChange,
}: {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  showToolbar?: boolean;
  className?: string;
  peopleMentions?: boolean;
  onMentionsChange?: (mentions: MentionSuggestion[]) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
      ...(peopleMentions
        ? [
            Mention.configure({
              HTMLAttributes: {
                class: 'mention',
              },
              suggestion: mentionSuggestionOptions,
            }),
          ]
        : []),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      if (onMentionsChange) {
        const json = editor.getJSON();
        const mentions = getMentionsFromJSON(json);
        onMentionsChange(mentions);
      }
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[150px]',
      },
    },
  });

  // automatically focus the editor when the component mounts
  useEffect(() => {
    editor?.chain().focus().run();
  }, [editor]);

  // Sync content prop changes with editor state
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.chain().focus().setContent(content).run();
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn('flex flex-col text-sm', className)}>
      {showToolbar && (
        <div className="flex flex-wrap gap-1 border-b p-1">
          <Toggle
            size="icon"
            pressed={editor.isActive('bold')}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="icon"
            pressed={editor.isActive('italic')}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="icon"
            pressed={editor.isActive('he  ading', { level: 2 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            type="button"
          >
            <Heading2 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="icon"
            pressed={editor.isActive('heading', { level: 3 })}
            onPressedChange={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            type="button"
          >
            <Heading3 className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="icon"
            pressed={editor.isActive('bulletList')}
            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            type="button"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="icon"
            pressed={editor.isActive('orderedList')}
            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            type="button"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>
          <Toggle
            size="icon"
            pressed={editor.isActive('link')}
            onPressedChange={addLink}
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </Toggle>
          <div className="ml-auto flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              type="button"
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              type="button"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <div className="min-h-[150px] p-3">
        <EditorContent editor={editor} className="relative">
          {editor.getText() === '' && (
            <p className="absolute top-0 left-0 text-muted-foreground">{placeholder}</p>
          )}
        </EditorContent>
      </div>
    </div>
  );
}
