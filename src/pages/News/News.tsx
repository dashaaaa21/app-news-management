import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNews } from '../../common/hooks/useNews';
import type {
    INewsResponse,
    ICreateNewsRequest,
} from '../../common/types/news-type';
import { NewspaperEditor } from '../../components/news/NewspaperEditor';
import type { Block } from '../../components/news/newsBlocks';
import { blocksToJSON, JSONToBlocks } from '../../components/news/newsBlocks';

export default function News() {
    const location = useLocation();
    const {
        news,
        isLoading,
        error,
        fetchAllNews,
        createNewNews,
        updateExistingNews,
        deleteExistingNews,
        clearError,
    } = useNews();

    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState<INewsResponse | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [previewArticle, setPreviewArticle] = useState<INewsResponse | null>(
        null,
    );

    const [formTitle, setFormTitle] = useState('');
    const [formAuthor, setFormAuthor] = useState('');
    const [formBlocks, setFormBlocks] = useState<Block[]>([]);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const userRole = location.pathname.includes('/reporter/')
        ? 'reporter'
        : location.pathname.includes('/manager/')
          ? 'manager'
          : 'admin';
    const canEdit = userRole === 'admin' || userRole === 'reporter';

    useEffect(() => {
        fetchAllNews();
    }, [fetchAllNews]);

    const openCreate = () => {
        setFormTitle('');
        setFormAuthor('');
        setFormBlocks([]);
        setFormErrors({});
        setEditingNews(null);
        setShowForm(true);
    };

    const openEdit = (article: INewsResponse) => {
        setFormTitle(article.title);
        setFormAuthor(article.author);
        setFormBlocks(JSONToBlocks(article.body));
        setFormErrors({});
        setEditingNews(article);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingNews(null);
        setFormErrors({});
        clearError();
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!formTitle.trim()) errs.title = 'Title is required';
        if (!formAuthor.trim()) errs.author = 'Author is required';
        if (formBlocks.length === 0) errs.body = 'Add at least one block';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        const data: ICreateNewsRequest = {
            title: formTitle,
            author: formAuthor,
            body: blocksToJSON(formBlocks),
        };
        const success = editingNews
            ? await updateExistingNews(editingNews._id, data)
            : await createNewNews(data);
        if (success) closeForm();
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        const success = await deleteExistingNews(deleteConfirm);
        if (success) setDeleteConfirm(null);
    };

    const formatDate = (d: string) =>
        new Date(d).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const getPreviewText = (body: string) => {
        const blocks = JSONToBlocks(body);
        return blocks
            .map((b) => b.content)
            .filter(Boolean)
            .join(' ')
            .substring(0, 100);
    };

    const renderPreviewBlock = (block: Block, index: number) => {
        if (block.type === 'divider')
            return <hr key={index} className="my-4 border-gray-300" />;
        if (block.type === 'spacer') return <div key={index} className="h-6" />;
        if (block.type === 'image-placeholder')
            return block.content ? (
                <img
                    key={index}
                    src={block.content}
                    alt=""
                    className="w-full rounded-lg object-cover max-h-96 my-4"
                />
            ) : (
                <div
                    key={index}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center my-4 bg-gray-50"
                >
                    <p className="text-sm text-gray-400">Image</p>
                </div>
            );
        if (!block.content?.trim()) return null;

        const fontSizeMap: Record<string, string> = {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
        };

        const style: React.CSSProperties = {
            backgroundColor: block.bgColor || 'transparent',
            color: block.textColor || '#111',
            fontSize: fontSizeMap[block.fontSize || 'base'],
            fontWeight:
                block.fontWeight === 'bold'
                    ? 700
                    : block.fontWeight === 'semibold'
                      ? 600
                      : block.fontWeight === 'medium'
                        ? 500
                        : 400,
            textAlign: block.textAlign || 'left',
            padding:
                block.padding === 'lg'
                    ? '24px'
                    : block.padding === 'md'
                      ? '16px'
                      : block.padding === 'sm'
                        ? '8px'
                        : '0',
            lineHeight: 1.7,
        };

        const colClass =
            block.layout === 'two-column'
                ? 'columns-2 gap-6'
                : block.layout === 'three-column'
                  ? 'columns-3 gap-4'
                  : '';

        const content = (
            <div
                key={index}
                style={style}
                className={`mb-2 ${colClass} ${block.type === 'quote' ? 'border-l-4 border-gray-400 italic' : ''}`}
            >
                {block.content}
            </div>
        );

        return content;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-[24px] border border-black/10 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-black/10">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            News
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {news.length} articles
                        </p>
                    </div>
                    {canEdit && (
                        <button
                            onClick={openCreate}
                            className="flex items-center gap-2 bg-[#CEFF7D] hover:bg-[#bef06a] text-black font-medium px-4 py-2 rounded-full text-sm transition-colors"
                        >
                            <span className="text-lg leading-none">+</span>
                            Create Article
                        </button>
                    )}
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={clearError}
                            className="text-red-400 hover:text-red-600 ml-4"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {isLoading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading...
                    </div>
                ) : news.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 text-base">
                            No articles yet
                        </p>
                        {canEdit && (
                            <button
                                onClick={openCreate}
                                className="mt-3 text-sm text-[#7ab800] hover:underline"
                            >
                                Create your first article
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-black/10 bg-gray-50/50">
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                        Author
                                    </th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {news.map((article) => (
                                    <tr
                                        key={article._id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 text-sm line-clamp-1 max-w-xs">
                                                {article.title}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs hidden sm:block">
                                                {getPreviewText(article.body)}
                                                ...
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className="text-sm text-gray-600">
                                                {article.author}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 hidden lg:table-cell">
                                            <span className="text-sm text-gray-500">
                                                {article.date
                                                    ? formatDate(article.date)
                                                    : '—'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setPreviewArticle(
                                                            article,
                                                        )
                                                    }
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                                >
                                                    Preview
                                                </button>
                                                {canEdit && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                openEdit(
                                                                    article,
                                                                )
                                                            }
                                                            className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setDeleteConfirm(
                                                                    article._id,
                                                                )
                                                            }
                                                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── PREVIEW MODAL ── */}
            {previewArticle && (
                <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-gray-100 rounded-[24px] w-full max-w-5xl my-4 shadow-2xl overflow-hidden">
                        {/* toolbar */}
                        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">
                                    Preview
                                </span>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                    A4
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {canEdit && (
                                    <button
                                        onClick={() => {
                                            setPreviewArticle(null);
                                            openEdit(previewArticle);
                                        }}
                                        className="px-4 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    onClick={() => setPreviewArticle(null)}
                                    className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* A4 page */}
                        <div
                            className="p-8 overflow-y-auto"
                            style={{ maxHeight: 'calc(90vh - 64px)' }}
                        >
                            <div
                                className="bg-white shadow-lg mx-auto"
                                style={{
                                    width: '210mm',
                                    minHeight: '297mm',
                                    padding: '20mm',
                                    fontFamily: 'Georgia, serif',
                                }}
                            >
                                {/* Newspaper header */}
                                <div className="text-center border-b-4 border-black pb-4 mb-6">
                                    <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-1">
                                        {previewArticle.date
                                            ? formatDate(previewArticle.date)
                                            : ''}
                                        {previewArticle.author &&
                                            ` · By ${previewArticle.author}`}
                                    </p>
                                    <h1 className="text-4xl font-black tracking-tight leading-tight">
                                        {previewArticle.title}
                                    </h1>
                                    <div className="flex items-center justify-center gap-2 mt-3">
                                        <div className="h-px bg-black flex-1" />
                                        <span className="text-xs tracking-widest uppercase px-2">
                                            Article
                                        </span>
                                        <div className="h-px bg-black flex-1" />
                                    </div>
                                </div>

                                {/* Blocks */}
                                <div>
                                    {JSONToBlocks(previewArticle.body).map(
                                        (block, i) =>
                                            renderPreviewBlock(block, i),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── EDITOR MODAL ── */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-[24px] w-full max-w-7xl my-4 shadow-2xl overflow-hidden">
                        {/* sticky header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                            <h2 className="text-lg font-semibold">
                                {editingNews
                                    ? 'Edit Article'
                                    : 'Create Article'}
                            </h2>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) =>
                                        handleSubmit(
                                            e as unknown as React.FormEvent,
                                        )
                                    }
                                    disabled={isLoading}
                                    className="px-5 py-2 text-sm font-medium bg-[#CEFF7D] hover:bg-[#bef06a] text-black rounded-full transition-colors disabled:opacity-50"
                                >
                                    {isLoading
                                        ? 'Saving...'
                                        : editingNews
                                          ? 'Save Changes'
                                          : 'Publish'}
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Meta fields */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) =>
                                            setFormTitle(e.target.value)
                                        }
                                        placeholder="Article title"
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${formErrors.title ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`}
                                    />
                                    {formErrors.title && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {formErrors.title}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={formAuthor}
                                        onChange={(e) =>
                                            setFormAuthor(e.target.value)
                                        }
                                        placeholder="Author name"
                                        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${formErrors.author ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-gray-400'}`}
                                    />
                                    {formErrors.author && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {formErrors.author}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {formErrors.body && (
                                <p className="text-xs text-red-500 mb-3">
                                    {formErrors.body}
                                </p>
                            )}

                            {/* Block editor */}
                            <NewspaperEditor
                                blocks={formBlocks}
                                onChange={setFormBlocks}
                            />
                        </form>
                    </div>
                </div>
            )}

            {/* ── DELETE MODAL ── */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-sm p-6 shadow-xl">
                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                            Delete Article
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
