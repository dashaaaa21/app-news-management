import React, { useRef, useState, Fragment } from 'react';
import logo from '../../assets/icons/chart-logo.svg';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const getPattern = (ctx: CanvasRenderingContext2D) => {
    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const pctx = canvas.getContext('2d');
    if (!pctx) return '#4b5563';
    pctx.strokeStyle = '#4b5563';
    pctx.lineWidth = 2;
    pctx.beginPath();
    pctx.moveTo(0, 12);
    pctx.lineTo(12, 0);
    pctx.stroke();
    return ctx.createPattern(canvas, 'repeat') || '#4b5563';
};

const EarningsChart: React.FC = () => {
    const chartRef = useRef<ChartJS<'bar'>>(null);
    const [selectedYear, setSelectedYear] = useState({
        id: 1,
        name: 'Last Year',
        value: 'Last Year',
    });

    const yearOptions = [
        { id: 1, name: 'Last Year', value: 'Last Year' },
        { id: 2, name: 'This Year', value: 'This Year' },
    ];

    const labels = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const dataByYear = {
        'Last Year': [
            5000, 12000, 23000, 51043, 33000, 26000, 15000, 21000, 40000, 24000,
            31000, 15000,
        ],
        'This Year': [
            8000, 15000, 28000, 45000, 38000, 32000, 20000, 25000, 42000, 28000,
            35000, 18000,
        ],
    };

    const dataValues =
        dataByYear[selectedYear.value as keyof typeof dataByYear];

    const data: ChartData<'bar'> = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: (context) => {
                    const { ctx } = context.chart;
                    return getPattern(ctx);
                },
                borderColor: '#374151',
                borderWidth: 1,
                borderRadius: 20,
                borderSkipped: false,
                barPercentage: 0.5,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#d9f99d',
                titleColor: '#1a2e05',
                bodyColor: '#1a2e05',
                bodyFont: { weight: 'bold' },
                padding: 12,
                displayColors: false,
                yAlign: 'bottom',
                callbacks: {
                    title: () => '',
                    label: (context) => {
                        const value = context.parsed.y;
                        return value !== null
                            ? value.toLocaleString('en-US')
                            : '0';
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                border: { display: false },
                grid: { color: '#f3f4f6' },
                ticks: {
                    callback: (val) =>
                        Number(val) === 0 ? '0' : `${Number(val) / 1000}k`,
                    color: '#9ca3af',
                    font: { size: 11 },
                },
            },
            x: {
                border: { display: false },
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 11 } },
            },
        },
    };

    return (
        <div
            className="bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col box-border overflow-hidden"
            style={{ width: '100%', height: '100%' }}
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4 mb-5">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-8 md:w-10 h-8 md:h-10 object-contain flex-shrink-0"
                    />
                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-gray-800 leading-tight">
                            Statistic new news
                        </h2>
                        <p className="text-xs text-gray-400 font-medium">
                            Yearly Earnings Overview
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-36">
                        <Listbox
                            value={selectedYear}
                            onChange={setSelectedYear}
                        >
                            <div className="relative">
                                <Listbox.Button className="relative w-full flex items-center justify-between gap-2 bg-[#F2F2EC] py-2 px-4 rounded-full text-sm font-medium text-[#2D2D2D] hover:bg-gray-200 transition-colors focus:outline-none">
                                    <span className="block truncate">
                                        {selectedYear.name}
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
                                        {yearOptions.map((option) => (
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

            <div className="flex-1 w-full min-h-0">
                <Bar ref={chartRef} data={data} options={options} />
            </div>
        </div>
    );
};

export default EarningsChart;
