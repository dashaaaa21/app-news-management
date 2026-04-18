import { useState, useRef } from 'react';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type BlockType =
    | 'paragraph'
    | 'heading'
    | 'subheading'
    | 'quote'
    | 'list';

export interface Block {
    id: string;
    type: BlockType;
    content: string;
}

interface SortableBlockProps {
    block: Block;
    onChange: (id: string, content: string) => void;
    onRemove: (id: string) => void;
    onChangeType: (id: string, type: BlockType) => void;
}

const blockTypes: { value: BlockType; label: string }[] = [
    { value: 'paragraph', label: 'Paragraph' },
    { value: 'heading', label: 'Heading' },
    { value: 'subheading', label: 'Subheading' },
    { value: 'quote', label: 'Quote' },
    { value: 'list', label: 'List item' },
];

function getInputClass(type: BlockType): string {
    switch (type) {
        case 'heading':
            return 'text-2xl font-bold text-gray-900 placeholder:text-gray-300';
        case 'subheading':
            return 'text-lg font-semibold text-gray-800 placeholder:text-gray-300';
        case 'quote':
            return 'text-base italic text-gray-600 border-l-4 border-[#CEFF7D] pl-4 placeholder:text-gray-300';
        default:
            return 'text-base text-gray-700 placeholder:text-gray-300';
    }
}

function getPlaceholder(type: BlockType): string {
    switch (type) {
        case 'heading':
            return 'Heading...';
        case 'subheading':
            return 'Subheading...';
        case 'quote':
            return 'Quote...';
        case 'list':
            return '• List item...';
        default:
            return 'Write something...';
    }
}

function autoResize(e: React.FormEvent<HTMLTextAreaElement>) {
    const t = e.target as HTMLTextAreaElement;
    t.style.height = 'auto';
    t.style.height = t.scrollHeight + 'px';
}

function SortableBlock({
    block,
    onChange,
    onRemove,
    onChangeType,
}: SortableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });
    const [focused, setFocused] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    const inputClass = getInputClass(block.type);
    const placeholder = getPlaceholder(block.type);
    const baseTextarea = `w-full bg-transparent outline-none resize-none leading-relaxed ${inputClass}`;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group relative flex gap-2 items-start rounded-xl transition-colors ${focused ? 'bg-gray-50' : 'hover:bg-gray-50/60'} px-2 py-1`}
        >
            <button
                {...attributes}
                {...listeners}
                type="button"
                tabIndex={-1}
                className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 touch-none"
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <circle cx="5" cy="4" r="1.5" />
                    <circle cx="11" cy="4" r="1.5" />
                    <circle cx="5" cy="8" r="1.5" />
                    <circle cx="11" cy="8" r="1.5" />
                    <circle cx="5" cy="12" r="1.5" />
                    <circle cx="11" cy="12" r="1.5" />
                </svg>
            </button>

            <div className="flex-1 min-w-0">
                <div
                    className={`mb-1 transition-opacity ${focused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                    <div className="flex gap-1 flex-wrap">
                        {blockTypes.map((bt) => (
                            <button
                                key={bt.value}
                                type="button"
                                onClick={() => onChangeType(block.id, bt.value)}
                                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${block.type === bt.value ? 'bg-[#CEFF7D] text-black font-medium' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                            >
                                {bt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {block.type === 'list' ? (
                    <div className="flex items-start gap-2">
                        <span className="mt-1 text-gray-400 text-sm shrink-0">
                            •
                        </span>
                        <textarea
                            value={block.content}
                            onChange={(e) => onChange(block.id, e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            placeholder={placeholder}
                            rows={1}
                            className={baseTextarea}
                            style={{ minHeight: '28px' }}
                            onInput={autoResize}
                        />
                    </div>
                ) : (
                    <textarea
                        value={block.content}
                        onChange={(e) => onChange(block.id, e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder={placeholder}
                        rows={1}
                        className={baseTextarea}
                        style={{ minHeight: '28px' }}
                        onInput={autoResize}
                    />
                )}
            </div>

            <button
                type="button"
                onClick={() => onRemove(block.id)}
                tabIndex={-1}
                className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400 shrink-0"
            >
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}

interface BlockEditorProps {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );
    const counter = useRef(blocks.length + 1);

    const newId = () => `block-${++counter.current}`;

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            onChange(arrayMove(blocks, oldIndex, newIndex));
        }
    };

    const updateBlock = (id: string, content: string) =>
        onChange(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
    const removeBlock = (id: string) =>
        onChange(blocks.filter((b) => b.id !== id));
    const changeType = (id: string, type: BlockType) =>
        onChange(blocks.map((b) => (b.id === id ? { ...b, type } : b)));
    const addBlock = (type: BlockType) =>
        onChange([...blocks, { id: newId(), type, content: '' }]);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex-wrap">
                <span className="text-xs text-gray-400 mr-1">Add block:</span>
                {(
                    [
                        'paragraph',
                        'heading',
                        'subheading',
                        'quote',
                        'list',
                    ] as BlockType[]
                ).map((type) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => addBlock(type)}
                        className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-[#CEFF7D] hover:border-[#CEFF7D] hover:text-black transition-colors"
                    >
                        {type[0].toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="p-3 min-h-[200px]">
                {blocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="mb-2"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        <p className="text-sm">Add a block to start writing</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map((b) => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-1">
                                {blocks.map((block) => (
                                    <SortableBlock
                                        key={block.id}
                                        block={block}
                                        onChange={updateBlock}
                                        onRemove={removeBlock}
                                        onChangeType={changeType}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}
