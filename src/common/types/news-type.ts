export interface INews {
    _id?: string;
    id?: number;
    title: string;
    body: string;
    author: string;
    date?: string;
    description?: string;
    image?: string;
    category?: string;
    readTime?: string;
}

export interface ICreateNewsRequest {
    title: string;
    body: string;
    author: string;
    image?: File | string;
}

export interface IUpdateNewsRequest {
    title: string;
    body: string;
    author: string;
    image?: File | string;
}

export interface INewsResponse {
    _id: string;
    title: string;
    body: string;
    author: string;
    date: string;
    __v: number;
}

export interface IApiNewsResponse<T = unknown> {
    response?: T;
    error?: {
        message: string;
        status?: number;
    };
}

export interface IUseNewsReturn {
    news: INewsResponse[];
    currentNews: INewsResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchAllNews: () => Promise<void>;
    fetchNewsById: (id: string) => Promise<void>;
    createNewNews: (newsData: ICreateNewsRequest) => Promise<boolean>;
    updateExistingNews: (
        id: string,
        newsData: IUpdateNewsRequest,
    ) => Promise<boolean>;
    deleteExistingNews: (id: string) => Promise<boolean>;
    clearError: () => void;
}

export interface INewsFormProps {
    news?: INewsResponse | null;
    onSubmit: (newsData: ICreateNewsRequest) => Promise<boolean>;
    onCancel: () => void;
    isLoading: boolean;
}
