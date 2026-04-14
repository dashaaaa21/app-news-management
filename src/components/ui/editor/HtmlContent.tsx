import React from 'react';

interface HtmlContentProps {
    content: string;
    className?: string;
}

const HtmlContent: React.FC<HtmlContentProps> = ({
    content,
    className = '',
}) => {
    return (
        <div
            className={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

export default HtmlContent;
