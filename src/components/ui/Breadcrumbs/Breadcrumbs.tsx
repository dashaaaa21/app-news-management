import { Link } from 'react-router-dom';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <div className="flex items-center gap-2 text-sm mb-6">
            {items.map((item, index) => (
                <div
                    key={`breadcrumb-${index}-${item.label}`}
                    className="flex items-center gap-2"
                >
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900 font-medium">
                            {item.label}
                        </span>
                    )}
                    {index < items.length - 1 && (
                        <span className="text-gray-400">/</span>
                    )}
                </div>
            ))}
        </div>
    );
}
