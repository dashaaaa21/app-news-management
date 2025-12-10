import { useEffect, useState } from 'react';

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
        const fetchData = async () => {
            try {
                setLoading(true);
                const [response1, response2] = await Promise.all([
                    fetch('/src/data/StatTable-1.json'),
                    fetch('/src/data/StatTable-2.json'),
                ]);

                if (!response1.ok || !response2.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data1 = await response1.json();
                const data2 = await response2.json();

                setTableData(data1);
                setTableData2(data2);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred',
                );
                console.error('Error fetching table data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { tableData, tableData2, loading, error };
};
