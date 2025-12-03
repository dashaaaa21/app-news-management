import { Link, useLocation } from 'react-router-dom';
import { sidebarRoutes } from '../../router/sidebarRoutes';
import ChevronRightIcon from '../icons/ChevronRightIcon';

interface SidebarProps {
    isCompact?: boolean;
    isMobile?: boolean;
}

export default function Sidebar({
    isCompact = false,
    isMobile = false,
}: SidebarProps) {
    const location = useLocation();

    if (isMobile) {
        return (
            <nav className="bg-black border-t border-gray-800 p-2 flex justify-around items-center safe-area-inset-bottom">
                {sidebarRoutes.slice(0, 5).map((route) => {
                    const isActive = location.pathname === route.path;

                    return (
                        <Link
                            key={route.path}
                            to={route.path}
                            aria-label={route.name}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 max-w-[80px] ${
                                isActive ? 'bg-[#CEFF7D]' : 'hover:bg-[#262520]'
                            }`}
                        >
                            <div
                                className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 ${isActive ? 'text-black' : 'text-white'}`}
                            >
                                {route.icon}
                            </div>
                            <span
                                className={`text-xs leading-tight text-center truncate max-w-full ${isActive ? 'text-black' : 'text-white'}`}
                            >
                                {route.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        );
    }

    if (isCompact) {
        return (
            <nav className="bg-black rounded-[20px] p-2 flex flex-col gap-1 h-full min-h-0">
                {sidebarRoutes.map((route) => {
                    const isActive = location.pathname === route.path;

                    return (
                        <div key={route.path} className="relative group">
                            <Link
                                to={route.path}
                                aria-label={route.name}
                                aria-current={isActive ? 'page' : undefined}
                                className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                                    isActive
                                        ? 'bg-[#CEFF7D]'
                                        : 'hover:bg-[#262520]'
                                }`}
                            >
                                <div
                                    className={`w-6 h-6 ${isActive ? 'text-black' : 'text-white'}`}
                                >
                                    {route.icon}
                                </div>
                            </Link>

                            <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {route.name}
                                <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                            </div>
                        </div>
                    );
                })}
            </nav>
        );
    }

    return (
        <nav className="bg-black rounded-[30px] p-4 flex flex-col gap-1 h-full min-h-0">
            {sidebarRoutes.map((route) => {
                const isActive = location.pathname === route.path;

                return (
                    <Link
                        key={route.path}
                        to={route.path}
                        aria-label={route.name}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                            isActive ? 'bg-[#CEFF7D]' : 'hover:bg-[#262520]'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-6 h-6 ${isActive ? 'text-black' : 'text-white'}`}
                            >
                                {route.icon}
                            </div>
                            <span
                                className={`text-base ${isActive ? 'text-black' : 'text-white'}`}
                            >
                                {route.name}
                            </span>
                        </div>
                        <div
                            className={`p-2 rounded-full border ${isActive ? 'border-black/20' : 'border-white/20'}`}
                        >
                            <div
                                className={`w-4 h-4 ${isActive ? 'text-black' : 'text-white'}`}
                            >
                                <ChevronRightIcon />
                            </div>
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}
