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
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function Editor({
  content,
  onChange,
  placeholder = 'Start writing...',
  className,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[150px]',
      },
    },
  });

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
    <div
      className={cn(
        'flex flex-col bg-background text-sm rounded-md shadow-sm',
        className,
      )}
    >
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
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="icon"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
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
      <div className="min-h-[150px] p-3">
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h1:font-extrabold prose-h2:text-2xl prose-h3:text-xl prose-p:my-2 prose-p:leading-relaxed prose-li:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:pl-5 prose-ol:pl-5 [&:focus]:outline-none [&_*:focus]:outline-none"
        />
      </div>
    </div>
  );
}
