import { StatTable } from '../StatTable/StatTable';
import type { StatTableData } from './useStatTableData';

interface StatTableCellProps {
    loading: boolean;
    error: string | null;
    data: StatTableData | null;
}

export const StatTableCell = ({ loading, error, data }: StatTableCellProps) => {
    if (loading) {
        return (
            <div className="p-5 border border-solid border-black-100 rounded-[36px] flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-5 border border-solid border-black-100 rounded-[36px] flex items-center justify-center">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!data) return null;

    return <StatTable title={data.title} icon={data.icon} data={data.data} />;
};
