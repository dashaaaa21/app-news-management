interface NewsDetailHeroProps {
    title: string;
    description: string;
    isEditing: boolean;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
}

const COSMOS_IMAGE = '/assets/section-news1-cosmos/news-cosmos.png';

export default function NewsDetailHero({
    title,
    description,
    isEditing,
    onTitleChange,
    onDescriptionChange,
}: NewsDetailHeroProps) {
    const paragraphs = description.split('\n\n');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div>
                <img
                    src={COSMOS_IMAGE}
                    alt={title}
                    className="w-full rounded-[20px] object-cover"
                />
            </div>

            <div>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="w-full text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight border-2 border-gray-300 rounded-[20px] p-4 focus:outline-none focus:border-[#CEFF7D]"
                            placeholder="Title"
                        />
                        <textarea
                            value={description}
                            onChange={(e) =>
                                onDescriptionChange(e.target.value)
                            }
                            className="w-full h-64 text-sm md:text-base leading-relaxed border-2 border-gray-300 rounded-[20px] p-4 focus:outline-none focus:border-[#CEFF7D] resize-none"
                            placeholder="Description"
                        />
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight">
                            {title}
                        </h1>
                        <div className="space-y-3 md:space-y-4 text-sm md:text-base leading-relaxed">
                            {paragraphs.map((paragraph, index) => (
                                <p
                                    key={`hero-paragraph-${index}-${paragraph.substring(0, 20)}`}
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
                    </>
                )}
            </div>
        </div>
    );
}
