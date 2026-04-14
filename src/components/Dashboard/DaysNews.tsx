import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const DaysNews = () => {
    const data = [
        { day: 'M', value: 30 },
        { day: 'T', value: 45 },
        { day: 'T', value: 60 },
        { day: 'W', value: 50 },
        { day: 'F', value: 55 },
        { day: 'S', value: 65 },
    ];

    return (
        <div className="rounded-[30px] border border-[#E6E7DE] p-4 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-12 md:mb-16">
                <div className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-[#2B2B2B] flex items-center justify-center flex-shrink-0">
                    <div className="grid grid-cols-2 gap-0.5 md:gap-1">
                        <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-[#2B2B2B] rounded-full"></div>
                        <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-[#2B2B2B] rounded-full"></div>
                        <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-[#2B2B2B] rounded-full"></div>
                        <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-[#2B2B2B] rounded-full"></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-[#2B2B2B] leading-tight">
                        Days news
                    </h3>
                    <p className="text-[10px] md:text-xs text-[#8F9488] font-medium">
                        Which day the best popular news
                    </p>
                </div>
            </div>

            <div
                style={{
                    width: '100%',
                    height: '280px',
                    minWidth: 0,
                    minHeight: 0,
                }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#84cc16"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#84cc16"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={true}
                        />
                        <XAxis
                            dataKey="day"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis hide={true} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#84cc16"
                            strokeWidth={3}
                            dot={false}
                            fill="url(#colorValue)"
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DaysNews;
