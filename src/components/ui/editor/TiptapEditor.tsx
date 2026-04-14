import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

interface TiptapEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
    content = '',
    onChange,
    placeholder = 'Start typing...',
    editable = true,
    className = '',
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 ${className}`,
                placeholder,
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {editable && (
                <div className="border-b border-gray-300 p-2 bg-gray-50 flex flex-wrap gap-1">
                    <button
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('bold') ? 'bg-gray-300' : ''
                        }`}
                        type="button"
                    >
                        <strong>B</strong>
                    </button>

                    <button
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('italic') ? 'bg-gray-300' : ''
                        }`}
                        type="button"
                    >
                        <em>I</em>
                    </button>

                    <button
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('underline') ? 'bg-gray-300' : ''
                        }`}
                        type="button"
                    >
                        <u>U</u>
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('heading', { level: 1 })
                                ? 'bg-gray-300'
                                : ''
                        }`}
                        type="button"
                    >
                        H1
                    </button>

                    <button
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('heading', { level: 2 })
                                ? 'bg-gray-300'
                                : ''
                        }`}
                        type="button"
                    >
                        H2
                    </button>

                    <button
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 3 })
                                .run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('heading', { level: 3 })
                                ? 'bg-gray-300'
                                : ''
                        }`}
                        type="button"
                    >
                        H3
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('bulletList') ? 'bg-gray-300' : ''
                        }`}
                        type="button"
                    >
                        • List
                    </button>

                    <button
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('orderedList') ? 'bg-gray-300' : ''
                        }`}
                        type="button"
                    >
                        1. List
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                        onClick={() =>
                            editor.chain().focus().setTextAlign('left').run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive({ textAlign: 'left' })
                                ? 'bg-gray-300'
                                : ''
                        }`}
                        type="button"
                    >
                        ←
                    </button>

                    <button
                        onClick={() =>
                            editor.chain().focus().setTextAlign('center').run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive({ textAlign: 'center' })
                                ? 'bg-gray-300'
                                : ''
                        }`}
                        type="button"
                    >
                        ↔
                    </button>

                    <button
                        onClick={() =>
                            editor.chain().focus().setTextAlign('right').run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive({ textAlign: 'right' })
                                ? 'bg-gray-300'
                                : ''
                        }`}
                        type="button"
                    >
                        →
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        className={`px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors ${
                            editor.isActive('blockquote') ? 'bg-gray-300' : ''
                        }`}
                        type="button"
                    >
                        Quote
                    </button>

                    <button
                        onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                        }
                        className="px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors"
                        type="button"
                    >
                        HR
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    <button
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                    >
                        ↶
                    </button>

                    <button
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                    >
                        ↷
                    </button>
                </div>
            )}

            <EditorContent
                editor={editor}
                className="min-h-[200px] max-h-[500px] overflow-y-auto"
            />
        </div>
    );
};

export default TiptapEditor;
