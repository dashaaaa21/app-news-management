import TopicsNews from '../Dashboard/TopicsNews.tsx';
import EarningsChart from '../Dashboard/Earningschart.tsx';
import DaysNews from '../Dashboard/DaysNews.tsx';
import { useStatTableData } from './useStatTableData';
import { StatTableCell } from './StatTableCell';

export const DashboardGrid = () => {
    const { tableData, tableData2, loading, error } = useStatTableData();

    return (
        <div className="grid grid-cols-12 gap-4 mt-3">
            <div
                className="col-span-12 lg:col-span-7"
                style={{ height: '400px', minWidth: 0, minHeight: 0 }}
            >
                <EarningsChart />
            </div>
            <div className="col-span-12 lg:col-span-5">
                <StatTableCell
                    loading={loading}
                    error={error}
                    data={tableData}
                />
            </div>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] gap-4">
                <TopicsNews totalOrders="8,258" />
                <DaysNews />
                <StatTableCell
                    loading={loading}
                    error={error}
                    data={tableData2}
                />
            </div>
        </div>
    );
};
