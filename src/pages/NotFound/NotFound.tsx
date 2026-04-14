import { Button } from '../../components/ui/buttons/Button';
import robotImg from '../../assets/robot-404.png';

export default function NotFound() {
    return (
        <div className="flex h-screen w-full bg-linear-to-r from-[#EFF5E9] via-[#F6F5EC] to-[#F1F8F7] overflow-hidden font-sans text-[#1a1a1a]">
            <main className="flex-1 flex flex-col relative h-full">
                {/* 404 Content */}
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 overflow-y-auto">
                    {/* max-w-[300px] обмежує ширину, щоб робот не був завеликим */}
                    <img
                        src={robotImg}
                        alt="Page not found robot"
                        className="max-w-87.5 w-full mb-8 drop-shadow-xl select-none"
                    />

                    <h1 className="text-3xl font-normal mb-3 text-gray-900">
                        Something is wrong
                    </h1>

                    <p className="text-gray-500 max-w-md mb-8 text-base leading-normal">
                        The page you are looking was moved, removed, renamed, or
                        might never exist!
                    </p>

                    <Button variant="primary">Go home</Button>
                </div>

                {/* Footer */}
                <footer className="flex justify-between px-10 py-6 text-xs text-gray-400 mt-auto shrink-0">
                    <span>Copyright © 2025</span>
                    <div className="flex gap-6">
                        <span className="cursor-pointer hover:text-gray-600 transition-colors">
                            Term & Conditions
                        </span>
                        <span className="cursor-pointer hover:text-gray-600 transition-colors">
                            Privacy & Policy
                        </span>
                    </div>
                </footer>
            </main>
        </div>
    );
}
