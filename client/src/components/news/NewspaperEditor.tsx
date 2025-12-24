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
import type { Block, BlockType, ColumnLayout, TextAlign } from './newsBlocks';

interface SortableBlockProps {
    block: Block;
    onChange: (id: string, updates: Partial<Block>) => void;
    onRemove: (id: string) => void;
}

function SortableBlock({ block, onChange, onRemove }: SortableBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: block.id });
    const [showSettings, setShowSettings] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getBlockStyle = () => {
        const base = 'w-full outline-none resize-none transition-colors';
        const padding = {
            none: 'p-0',
            sm: 'p-2',
            md: 'p-4',
            lg: 'p-6',
        }[block.padding || 'md'];

        const fontSize = {
            xs: 'text-xs',
            sm: 'text-sm',
            base: 'text-base',
            lg: 'text-lg',
            xl: 'text-xl',
            '2xl': 'text-2xl',
            '3xl': 'text-3xl',
            '4xl': 'text-4xl',
        }[block.fontSize || 'base'];

        const fontWeight = {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        }[block.fontWeight || 'normal'];

        const textAlign = {
            left: 'text-left',
            center: 'text-center',
            right: 'text-right',
            justify: 'text-justify',
        }[block.textAlign || 'left'];

        return `${base} ${padding} ${fontSize} ${fontWeight} ${textAlign}`;
    };

    const renderBlockInput = () => {
        const commonProps = {
            value: block.content,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange(block.id, { content: e.target.value }),
            className: getBlockStyle(),
            style: {
                backgroundColor: block.bgColor || 'transparent',
                color: block.textColor || '#000',
                minHeight: block.type === 'spacer' ? '40px' : '32px',
            },
        };

        switch (block.type) {
            case 'title':
                return (
                    <textarea
                        {...commonProps}
                        placeholder="Main Title"
                        rows={2}
                    />
                );
            case 'subtitle':
                return (
                    <textarea
                        {...commonProps}
                        placeholder="Subtitle"
                        rows={1}
                    />
                );
            case 'heading':
                return (
                    <textarea {...commonProps} placeholder="Heading" rows={1} />
                );
            case 'quote':
                return (
                    <textarea
                        {...commonProps}
                        placeholder="Quote text..."
                        rows={2}
                        className={`${commonProps.className} italic border-l-4 border-gray-300`}
                    />
                );
            case 'divider':
                return <div className="h-px bg-gray-300 my-2" />;
            case 'spacer':
                return <div className="h-8 bg-transparent" />;
            case 'image-placeholder':
                return (
                    <div className="relative">
                        {block.content ? (
                            <div className="relative group/img">
                                <img
                                    src={block.content}
                                    alt="uploaded"
                                    className="w-full rounded-lg object-cover max-h-96"
                                />
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg cursor-pointer">
                                    <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
                                        Change image
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const reader = new FileReader();
                                            reader.onloadend = () =>
                                                onChange(block.id, {
                                                    content:
                                                        reader.result as string,
                                                });
                                            reader.readAsDataURL(file);
                                        }}
                                    />
                                </label>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 cursor-pointer hover:border-[#CEFF7D] hover:bg-[#CEFF7D]/5 transition-colors">
                                <svg
                                    className="h-10 w-10 text-gray-400 mb-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <p className="text-sm font-medium text-gray-600">
                                    Click to upload image
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    PNG, JPG, GIF up to 10MB
                                </p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onloadend = () =>
                                            onChange(block.id, {
                                                content:
                                                    reader.result as string,
                                            });
                                        reader.readAsDataURL(file);
                                    }}
                                />
                            </label>
                        )}
                    </div>
                );
            default:
                return (
                    <textarea
                        {...commonProps}
                        placeholder="Write content..."
                        rows={3}
                    />
                );
        }
    };

    const renderLayoutPreview = () => {
        if (!block.layout || block.layout === 'full') return null;
        return (
            <div className="absolute top-1 right-1 text-[10px] bg-white/90 px-1.5 py-0.5 rounded text-gray-500 pointer-events-none">
                {block.layout === 'two-column' ? '2 col' : '3 col'}
            </div>
        );
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative">
            <div
                className={`border-2 transition-colors rounded-lg ${isDragging ? 'border-blue-400' : 'border-transparent hover:border-gray-200'}`}
            >
                {/* Drag handle */}
                <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none p-1"
                        type="button"
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
                </div>

                {/* Settings button */}
                <div className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <button
                        type="button"
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => onRemove(block.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {renderLayoutPreview()}

                {/* Block content */}
                <div
                    className={
                        block.layout === 'two-column'
                            ? 'columns-2 gap-4'
                            : block.layout === 'three-column'
                              ? 'columns-3 gap-4'
                              : ''
                    }
                >
                    {renderBlockInput()}
                </div>

                {/* Settings panel */}
                {showSettings && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <label className="block text-gray-600 mb-1">
                                    Layout
                                </label>
                                <select
                                    value={block.layout || 'full'}
                                    onChange={(e) =>
                                        onChange(block.id, {
                                            layout: e.target
                                                .value as ColumnLayout,
                                        })
                                    }
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                >
                                    <option value="full">Full width</option>
                                    <option value="two-column">
                                        2 columns
                                    </option>
                                    <option value="three-column">
                                        3 columns
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">
                                    Align
                                </label>
                                <select
                                    value={block.textAlign || 'left'}
                                    onChange={(e) =>
                                        onChange(block.id, {
                                            textAlign: e.target
                                                .value as TextAlign,
                                        })
                                    }
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                    <option value="justify">Justify</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">
                                    Size
                                </label>
                                <select
                                    value={block.fontSize || 'base'}
                                    onChange={(e) =>
                                        onChange(block.id, {
                                            fontSize: e.target
                                                .value as Block['fontSize'],
                                        })
                                    }
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                >
                                    <option value="xs">XS</option>
                                    <option value="sm">Small</option>
                                    <option value="base">Base</option>
                                    <option value="lg">Large</option>
                                    <option value="xl">XL</option>
                                    <option value="2xl">2XL</option>
                                    <option value="3xl">3XL</option>
                                    <option value="4xl">4XL</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">
                                    Weight
                                </label>
                                <select
                                    value={block.fontWeight || 'normal'}
                                    onChange={(e) =>
                                        onChange(block.id, {
                                            fontWeight: e.target
                                                .value as Block['fontWeight'],
                                        })
                                    }
                                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="medium">Medium</option>
                                    <option value="semibold">Semibold</option>
                                    <option value="bold">Bold</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">
                                    BG Color
                                </label>
                                <input
                                    type="color"
                                    value={block.bgColor || '#ffffff'}
                                    onChange={(e) =>
                                        onChange(block.id, {
                                            bgColor: e.target.value,
                                        })
                                    }
                                    className="w-full h-7 border border-gray-200 rounded cursor-pointer"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-600 mb-1">
                                    Text Color
                                </label>
                                <input
                                    type="color"
                                    value={block.textColor || '#000000'}
                                    onChange={(e) =>
                                        onChange(block.id, {
                                            textColor: e.target.value,
                                        })
                                    }
                                    className="w-full h-7 border border-gray-200 rounded cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface NewspaperEditorProps {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
}

export function NewspaperEditor({ blocks, onChange }: NewspaperEditorProps) {
    const idCounter = useRef(0);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b.id === active.id);
            const newIndex = blocks.findIndex((b) => b.id === over.id);
            onChange(arrayMove(blocks, oldIndex, newIndex));
        }
    };

    const updateBlock = (id: string, updates: Partial<Block>) =>
        onChange(blocks.map((b) => (b.id === id ? { ...b, ...updates } : b)));

    const removeBlock = (id: string) =>
        onChange(blocks.filter((b) => b.id !== id));

    const addBlock = (type: BlockType) => {
        const defaults: Partial<Block> =
            (
                {
                    title: {
                        fontSize: '4xl',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: 'lg',
                    },
                    subtitle: {
                        fontSize: '2xl',
                        fontWeight: 'medium',
                        textAlign: 'center',
                        padding: 'md',
                    },
                    heading: {
                        fontSize: 'xl',
                        fontWeight: 'bold',
                        padding: 'sm',
                    },
                    paragraph: {
                        fontSize: 'base',
                        textAlign: 'justify',
                        padding: 'sm',
                    },
                    quote: {
                        fontSize: 'lg',
                        fontWeight: 'medium',
                        bgColor: '#f9fafb',
                        padding: 'md',
                    },
                } as Record<string, Partial<Block>>
            )[type] || {};

        onChange([
            ...blocks,
            {
                id: `block-${++idCounter.current}`,
                type,
                content: '',
                ...defaults,
            },
        ]);
    };

    return (
        <div className="flex gap-4">
            {/* Toolbar */}
            <div className="w-48 shrink-0 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Add Block
                </p>
                {(
                    [
                        ['title', '📰', 'Title'],
                        ['subtitle', '📄', 'Subtitle'],
                        ['heading', 'H', 'Heading'],
                        ['paragraph', 'P', 'Paragraph'],
                        ['quote', '❝', 'Quote'],
                        ['divider', '—', 'Divider'],
                        ['spacer', '⎵', 'Spacer'],
                        ['image-placeholder', '🖼', 'Image'],
                    ] as [BlockType, string, string][]
                ).map(([type, icon, label]) => (
                    <button
                        key={type}
                        type="button"
                        onClick={() => addBlock(type)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-[#CEFF7D] hover:border-[#CEFF7D] transition-colors"
                    >
                        <span className="text-base">{icon}</span>
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            {/* A4 Canvas */}
            <div
                className="flex-1 bg-gray-100 p-8 rounded-xl overflow-auto"
                style={{ maxHeight: '80vh' }}
            >
                <div
                    className="bg-white shadow-lg mx-auto"
                    style={{
                        width: '210mm',
                        minHeight: '297mm',
                        padding: '20mm',
                    }}
                >
                    {blocks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="mb-3"
                            >
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            <p className="text-sm">
                                Add blocks to start creating
                            </p>
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
                                <div className="space-y-3 pl-8 pr-8">
                                    {blocks.map((block) => (
                                        <SortableBlock
                                            key={block.id}
                                            block={block}
                                            onChange={updateBlock}
                                            onRemove={removeBlock}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
}
