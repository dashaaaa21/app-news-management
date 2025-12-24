export type BlockType =
    | 'title'
    | 'subtitle'
    | 'heading'
    | 'paragraph'
    | 'quote'
    | 'divider'
    | 'spacer'
    | 'image-placeholder';
export type ColumnLayout = 'full' | 'two-column' | 'three-column';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export interface Block {
    id: string;
    type: BlockType;
    content: string;
    layout?: ColumnLayout;
    textAlign?: TextAlign;
    bgColor?: string;
    textColor?: string;
    fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function blocksToJSON(blocks: Block[]): string {
    return JSON.stringify(blocks);
}

export function JSONToBlocks(json: string): Block[] {
    if (!json?.trim()) return [];
    try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (_e) {
        void _e;
    }
    return json
        .split('\n')
        .filter((line) => line.trim())
        .map((line, i) => ({
            id: `block-legacy-${i}`,
            type: 'paragraph' as BlockType,
            content: line.trim(),
            textAlign: 'left' as const,
            fontSize: 'base' as const,
            fontWeight: 'normal' as const,
            padding: 'sm' as const,
        }));
}
