import RelatedNewsCard from './RelatedNewsCard';

interface RelatedNewsItem {
    id: number;
    image: string;
    title: string;
    description: string;
}

interface RelatedNewsGridProps {
    relatedNews: RelatedNewsItem[];
    isEditing: boolean;
    onUpdateNews: (news: RelatedNewsItem[]) => void;
}

export default function RelatedNewsGrid({
    relatedNews,
    isEditing,
    onUpdateNews,
}: RelatedNewsGridProps) {
    const handleUpdateCard = (
        id: number,
        field: 'title' | 'description',
        value: string,
    ) => {
        const updatedNews = relatedNews.map((item) =>
            item.id === id ? { ...item, [field]: value } : item,
        );
        onUpdateNews(updatedNews);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                {relatedNews.slice(0, 3).map((item) => (
                    <RelatedNewsCard
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        isEditing={isEditing}
                        onTitleChange={(value: string) =>
                            handleUpdateCard(item.id, 'title', value)
                        }
                        onDescriptionChange={(value: string) =>
                            handleUpdateCard(item.id, 'description', value)
                        }
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
                {relatedNews.slice(3, 5).map((item) => (
                    <RelatedNewsCard
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        description={item.description}
                        isEditing={isEditing}
                        onTitleChange={(value: string) =>
                            handleUpdateCard(item.id, 'title', value)
                        }
                        onDescriptionChange={(value: string) =>
                            handleUpdateCard(item.id, 'description', value)
                        }
                    />
                ))}
            </div>
        </>
    );
}
