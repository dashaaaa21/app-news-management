import { useState, useEffect } from 'react';
import statTable1Data from '../../data/StatTable-1.json';
import statTable2Data from '../../data/StatTable-2.json';

export interface NewsItem {
    id: number;
    title: string;
    count: number;
    date: string;
    imageUrl: string;
    isFaded?: boolean;
}

export interface StatTableData {
    title: string;
    icon: string;
    data: NewsItem[];
}

export const useStatTableData = () => {
    const [tableData, setTableData] = useState<StatTableData | null>(null);
    const [tableData2, setTableData2] = useState<StatTableData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            setLoading(true);
            setTableData(statTable1Data as StatTableData);
            setTableData2(statTable2Data as StatTableData);
            setError(null);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'An error occurred',
            );
            console.error('Error loading table data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { tableData, tableData2, loading, error };
};
