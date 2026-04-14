interface NewsDetailContentProps {
    content: string;
    isEditing: boolean;
    onContentChange: (content: string) => void;
}

export default function NewsDetailContent({
    content,
    isEditing,
    onContentChange,
}: NewsDetailContentProps) {
    if (isEditing) {
        return (
            <textarea
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full h-64 text-sm md:text-base leading-relaxed border-2 border-gray-300 rounded-[20px] p-4 focus:outline-none focus:border-[#CEFF7D] resize-none"
            />
        );
    }

    const paragraphs = content.split('\n\n');

    return (
        <div className="space-y-3 md:space-y-4 text-sm md:text-base leading-relaxed">
            {paragraphs.map((paragraph, index) => (
                <p
                    key={index}
                    className={
                        index === 0
                            ? 'first-letter:text-4xl md:first-letter:text-5xl lg:first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-2 md:first-letter:mr-3 first-letter:leading-none'
                            : ''
                    }
                >
                    {paragraph}
                </p>
            ))}
        </div>
    );
}
