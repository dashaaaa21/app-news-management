import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfileFromStorage } from '../../common/utils/profileStorage';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    backPath?: string;
}

function getPageTitle(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean);
    const meaningful = segments.slice(1).filter((s) => isNaN(Number(s)));
    const last = meaningful[meaningful.length - 1] ?? '';
    return last
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default function Header({
    title,
    showBackButton,
    backPath,
}: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [avatarUrl] = useState(() => {
        const profile = getProfileFromStorage();
        return (
            profile?.profilePicture ||
            'https://api.dicebear.com/7.x/avataaars/svg?seed=User&backgroundColor=b6e3f4'
        );
    });

    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isDashboard = location.pathname.endsWith('/dashboard');
    const shouldShowBackButton =
        showBackButton !== undefined ? showBackButton : !isDashboard;

    const getDashboardPath = (): string => {
        if (backPath) return backPath;
        if (location.pathname.startsWith('/manager'))
            return '/manager/dashboard';
        if (location.pathname.startsWith('/reporter'))
            return '/reporter/dashboard';
        return '/admin/dashboard';
    };

    const pageTitle = title ?? getPageTitle(location.pathname);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsSearchOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();

        document
            .querySelectorAll('mark[data-search-highlight]')
            .forEach((mark) => {
                const parent = mark.parentNode;
                if (parent) {
                    while (mark.firstChild) {
                        parent.insertBefore(mark.firstChild, mark);
                    }
                    parent.removeChild(mark);
                }
            });

        if (!query.length) {
            return;
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
        );

        const nodesToProcess: Array<{
            node: Node;
            matches: Array<{ start: number; end: number }>;
        }> = [];
        let currentNode;

        while ((currentNode = walker.nextNode())) {
            const text = currentNode.textContent || '';
            const lowerText = text.toLowerCase();
            const matches: Array<{ start: number; end: number }> = [];

            const words = text.match(/\b\w+\b/g) || [];
            let searchIndex = 0;

            words.forEach((word) => {
                const wordIndex = lowerText.indexOf(
                    word.toLowerCase(),
                    searchIndex,
                );
                if (wordIndex !== -1 && word.toLowerCase().startsWith(query)) {
                    matches.push({
                        start: wordIndex,
                        end: wordIndex + word.length,
                    });
                    searchIndex = wordIndex + word.length;
                }
            });

            if (matches.length > 0) {
                nodesToProcess.push({ node: currentNode, matches });
            }
        }

        nodesToProcess.reverse().forEach(({ node, matches }) => {
            const text = node.textContent || '';
            const parent = node.parentNode;

            if (!parent) return;

            const fragment = document.createDocumentFragment();
            let lastIndex = 0;

            matches.sort((a, b) => a.start - b.start);

            matches.forEach(({ start, end }) => {
                if (start > lastIndex) {
                    fragment.appendChild(
                        document.createTextNode(
                            text.substring(lastIndex, start),
                        ),
                    );
                }

                const mark = document.createElement('mark');
                mark.setAttribute('data-search-highlight', 'true');
                mark.style.backgroundColor = '#BFFF00';
                mark.style.fontWeight = '600';
                mark.textContent = text.substring(start, end);
                fragment.appendChild(mark);

                lastIndex = end;
            });

            if (lastIndex < text.length) {
                fragment.appendChild(
                    document.createTextNode(text.substring(lastIndex)),
                );
            }

            parent.replaceChild(fragment, node);
        });
    }, [searchQuery]);

    return (
        <header className="px-3 sm:px-6 py-4">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 sm:gap-4">
                    {shouldShowBackButton && (
                        <button
                            onClick={() => navigate(getDashboardPath())}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#E8EAE6] hover:bg-[#D5D8D2] transition-colors text-gray-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 14 4 9l5-5" />
                                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
                            </svg>
                        </button>
                    )}
                    <h1 className="text-[28px] font-normal text-gray-800 tracking-wide">
                        {pageTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div
                        ref={searchRef}
                        className={`flex items-center bg-[#E8EAE6] rounded-full transition-all duration-300 overflow-hidden ${isSearchOpen ? 'w-48 sm:w-64 bg-white border border-gray-200 shadow-sm' : 'w-10'}`}
                    >
                        <button
                            onClick={() => {
                                setIsSearchOpen(true);
                                setIsDropdownOpen(false);
                            }}
                            className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-colors text-gray-700 ${!isSearchOpen && 'hover:bg-[#D5D8D2]'}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>

                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`bg-transparent outline-none text-[14px] text-gray-700 transition-all duration-300 ${isSearchOpen ? 'w-full pr-4 opacity-100' : 'w-0 opacity-0'}`}
                        />
                    </div>

                    <div className="relative shrink-0" ref={dropdownRef}>
                        <button
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen);
                                setIsSearchOpen(false);
                            }}
                            className="flex items-center h-10 gap-1.5 p-1 pr-3 rounded-full bg-[#E8EAE6] hover:bg-[#D5D8D2] transition-colors text-gray-500"
                        >
                            <img
                                src={avatarUrl}
                                alt="User avatar"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50 overflow-hidden">
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate('/admin/settings');
                                    }}
                                    className="w-full text-left px-5 py-2.5 text-[14px] text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Settings
                                </button>

                                <hr className="my-1.5 border-gray-100" />

                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate('/login');
                                    }}
                                    className="w-full text-left px-5 py-2.5 text-[14px] text-red-500 font-medium hover:bg-red-50 transition-colors"
                                >
                                    Exit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
