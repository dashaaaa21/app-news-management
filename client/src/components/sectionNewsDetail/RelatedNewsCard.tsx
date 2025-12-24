interface RelatedNewsCardProps {
    image: string;
    title: string;
    description?: string;
    isEditing?: boolean;
    onTitleChange?: (value: string) => void;
    onDescriptionChange?: (value: string) => void;
}

export default function RelatedNewsCard({
    image,
    title,
    description,
    isEditing = false,
    onTitleChange,
    onDescriptionChange,
}: RelatedNewsCardProps) {
    return (
        <div>
            <img
                src={image}
                alt={title}
                className="w-full h-40 md:h-48 object-cover rounded-[20px] mb-3 md:mb-4"
            />

            {isEditing ? (
                <textarea
                    value={title}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-[20px] focus:border-[#CEFF7D] focus:outline-none font-semibold text-sm md:text-base mb-2 resize-none"
                    rows={3}
                />
            ) : (
                <h3 className="font-semibold text-sm md:text-base mb-2">
                    {title}
                </h3>
            )}

            {(description || isEditing) && (
                <>
                    {isEditing ? (
                        <textarea
                            value={description || ''}
                            onChange={(e) =>
                                onDescriptionChange?.(e.target.value)
                            }
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-[20px] focus:border-[#CEFF7D] focus:outline-none text-xs md:text-sm text-gray-600 resize-none"
                            rows={3}
                            placeholder="Description (optional)"
                        />
                    ) : (
                        <p className="text-xs md:text-sm text-gray-600">
                            {description}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
