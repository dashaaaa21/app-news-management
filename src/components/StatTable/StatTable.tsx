import Zap from '../../../assets/Zap.svg';
import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

type SortType = 'date' | 'count' | 'name';

const timeOptions = [
    { id: 1, name: 'By Date', value: 'date' as SortType },
    { id: 2, name: 'By Count', value: 'count' as SortType },
    { id: 3, name: 'By Name', value: 'name' as SortType },
];

interface NewsItem {
    id: number;
    title: string;
    count: number;
    date: string;
    imageUrl: string;
    isFaded?: boolean;
}

interface StatTableProps {
    title?: string;
    icon?: string;
    data: NewsItem[];
}

export const StatTable = ({
    title = 'Our company',
    icon = Zap,
    data = [],
}: StatTableProps) => {
    const [selectedTime, setSelectedTime] = useState(timeOptions[0]);

    const getSortedData = () => {
        const dataCopy = [...data];

        switch (selectedTime.value) {
            case 'date':
                return dataCopy.sort((a, b) => {
                    const dateA = a.date.split('.').reverse().join('-');
                    const dateB = b.date.split('.').reverse().join('-');
                    return dateB.localeCompare(dateA);
                });
            case 'count':
                return dataCopy.sort((a, b) => b.count - a.count);
            case 'name':
                return dataCopy.sort((a, b) => a.title.localeCompare(b.title));
            default:
                return dataCopy;
        }
    };

    const sortedData = getSortedData();

    return (
        <div className="p-4 md:p-5 border border-solid border-[#E6E7DE] rounded-[30px]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-5">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <img
                        src={icon}
                        alt="icon"
                        className="w-8 md:w-10 h-8 md:h-10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <h4 className="text-base md:text-lg font-semibold text-[#2B2B2B] leading-tight truncate">
                            {title}
                        </h4>
                        <p className="text-[10px] md:text-xs text-[#8F9488] font-medium truncate">
                            {title === 'Our company'
                                ? 'Company Overview'
                                : 'Popular News'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-36">
                        <Listbox
                            value={selectedTime}
                            onChange={setSelectedTime}
                        >
                            <div className="relative">
                                <Listbox.Button className="relative w-full flex items-center justify-between gap-2 bg-[#F2F2EC] py-2 px-4 rounded-full text-sm font-medium text-[#2D2D2D] hover:bg-gray-200 transition-colors focus:outline-none">
                                    <span className="block truncate">
                                        {selectedTime.name}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className="text-[#2D2D2D] shrink-0"
                                    />
                                </Listbox.Button>

                                <Transition
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                        {timeOptions.map((option) => (
                                            <Listbox.Option
                                                key={option.id}
                                                className={({ active }) =>
                                                    `relative cursor-default select-none py-2 px-4 rounded-xl transition-colors ${
                                                        active
                                                            ? 'bg-[#F2F2EC] text-[#2D2D2D]'
                                                            : 'text-gray-700'
                                                    }`
                                                }
                                                value={option}
                                            >
                                                {({ selected }) => (
                                                    <span
                                                        className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}
                                                    >
                                                        {option.name}
                                                    </span>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        </Listbox>
                    </div>
                </div>
            </div>

            <div className="w-full p-1 rounded-xl font-sans">
                <div className="grid grid-cols-[2fr_1fr_1fr] items-center text-[#6B6B66] text-xs md:text-sm mb-2 px-2 gap-2">
                    <div className="flex items-center text-[12px] md:text-[14px] gap-1 md:gap-2 cursor-pointer hover:text-gray-800 transition-colors truncate">
                        <span>News</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 5v14" />
                            <path d="M19 12l-7 7-7-7" />
                        </svg>
                    </div>
                    <div className="text-center text-[12px] md:text-[14px]">
                        News
                    </div>
                    <div className="text-right text-[12px] md:text-[14px]">
                        Date start
                    </div>
                </div>

                <div className="border-b border-dashed border-[#CFCFCB]"></div>

                <div className="flex flex-col">
                    {sortedData.map((item) => (
                        <div
                            key={item.id}
                            className={`
                                    grid grid-cols-[2fr_1fr_1fr] items-center py-2 border-b border-[#E5E5E1] last:border-0 gap-2
                                    ${item.isFaded ? 'opacity-40 grayscale' : ''}
                                `}
                        >
                            <div className="flex items-center gap-2 md:gap-4 pl-2 min-w-0">
                                <div className="w-10 md:w-12 h-8 md:h-10 rounded-md overflow-hidden bg-orange-100 flex-shrink-0 border border-black/5">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-[#1A1A1A] text-[12px] md:text-[14px] font-medium tracking-tight truncate">
                                    {item.title}
                                </span>
                            </div>

                            <div className="text-center text-[12px] md:text-[14px] text-[#1A1A1A]">
                                {item.count}
                            </div>

                            <div className="text-right text-[12px] md:text-[14px] text-[#1A1A1A] pr-2">
                                {item.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
