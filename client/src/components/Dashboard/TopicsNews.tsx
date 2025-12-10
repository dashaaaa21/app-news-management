import shopImg from '../../../assets/Shop.svg';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

type Props = {
    totalOrders: string;
};

export default function TopicsNews({ totalOrders }: Props) {
    const topics = [
        {
            name: 'Electronic',
            value: 82.5,
            color: '#84cc16',
        },
        {
            name: 'Fashion',
            value: 23.8,
            color: '#fbbf24',
        },
        {
            name: 'Decor',
            value: 84.9,
            color: '#f87171',
        },
        {
            name: 'Sports',
            value: 9.4,
            color: '#60a5fa',
        },
    ];

    return (
        <div className="rounded-[30px] border border-[#E6E7DE] p-4 md:p-5">
            <div className="flex items-center gap-2 md:gap-3 mb-8 md:mb-10">
                <img
                    src={shopImg}
                    alt="Shop"
                    className="h-8 md:h-10 w-8 md:w-10 flex-shrink-0"
                />
                <div>
                    <h3 className="text-lg font-semibold text-[#2B2B2B] leading-tight">
                        Topics news
                    </h3>
                    <p className="text-xs text-[#8F9488] font-medium">
                        Category Distribution
                    </p>
                </div>
            </div>

            <div
                className="relative flex justify-center items-center"
                style={{ height: '200px', minWidth: 0, minHeight: 0 }}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={topics}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {topics.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute text-center">
                    <div className="text-2xl md:text-[28px] font-semibold text-[#1F1F1F]">
                        {totalOrders}
                    </div>
                    <div className="text-[11px] md:text-[13px] text-[#8F9488]">
                        Total Orders
                    </div>
                </div>
            </div>

            <div className="mt-6 md:mt-8 space-y-2 md:space-y-3">
                {topics.map((t, idx) => (
                    <div
                        key={`topic-${idx}-${t.name}`}
                        className="flex items-center justify-between gap-2"
                    >
                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: t.color }}
                            ></div>

                            <div className="min-w-0">
                                <div className="text-xs md:text-[14px] font-medium text-[#2B2B2B] truncate">
                                    {t.name}
                                </div>
                            </div>
                        </div>

                        <div className="text-xs md:text-[14px] font-medium text-[#2B2B2B] flex-shrink-0">
                            {t.value}k
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
