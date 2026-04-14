import axios from 'axios';
import { getAccessToken } from '../../common/utils/localStorage';
import { getApiUrl } from '../../common/utils/apiConfig';
import type {
    INews,
    ICreateNewsRequest,
    IUpdateNewsRequest,
    INewsResponse,
    IApiNewsResponse,
} from '../../common/types/news-type';

const newsApiInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

newsApiInstance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => Promise.reject(error),
);

newsApiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    },
);

const mockNews: INews[] = [
    {
        id: 1,
        title: "A Pair in the Life of an astronaut: Humanity's Open Window to Space",
        description:
            'Astronauts recently use this technique of spacewalks to repair and maintain...',
        image: '/assets/section-news/news1.png',
        category: 'Space and Science',
        readTime: '5 mins read',
        body: 'Full article content here...',
        author: 'Space Reporter',
    },
    {
        id: 2,
        title: 'CMA Life Event: Q and A of Earth With Astronaut Matthias Maurer',
        description:
            'Investigate the impact of space technology on everyday life...',
        image: '/assets/section-news/news2.png',
        category: 'Technology',
        readTime: '4 mins read',
        body: 'Full article content here...',
        author: 'Tech Reporter',
    },
    {
        id: 3,
        title: 'NASA to Equip International Space Station With Finnish Lasers for Communications',
        description:
            'ISS space agency NASA plans to use a technology demonstration for space lasers using this theme...',
        image: '/assets/section-news/news3.png',
        category: 'Space and Science',
        readTime: '6 mins read',
        body: 'Full article content here...',
        author: 'NASA Correspondent',
    },
    {
        id: 4,
        title: 'Off-Duty Pilot Accused of Trying to Cut the Engines on an Alaska Air',
        description:
            'The flight was diverted to Portland, Ore., because of a "credible security threat" involving...',
        image: '/assets/section-news/news4.png',
        category: 'Technology',
        readTime: '4 mins read',
        body: 'Full article content here...',
        author: 'Aviation Reporter',
    },
    {
        id: 5,
        title: "Sayonara: End of the Line for ASIMO, Japan's Famed Robot",
        description:
            'It was almost football-ish format: US president Barack Obama and football to...',
        image: '/assets/section-news/news5.png',
        category: 'Technology',
        readTime: '5 mins read',
        body: 'Full article content here...',
        author: 'Tech Journalist',
    },
    {
        id: 6,
        title: 'Conditions on Earth May be Moving Outside the Safe Operating',
        description:
            'Recent studies have pointed the ways in which the danger zone in several key boundaries has been...',
        image: '/assets/section-news/news6.png',
        category: 'Our Planet',
        readTime: '6 mins read',
        body: 'Full article content here...',
        author: 'Environmental Reporter',
    },
    {
        id: 7,
        title: "Spain's Renfe Sets July Date for Now High-Speed Trains to France",
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        image: '/assets/section-news/news7.png',
        category: 'Technology',
        readTime: '4 mins read',
        body: 'Full article content here...',
        author: 'Transport Correspondent',
    },
    {
        id: 8,
        title: 'Axiom Space inflates training for next private astronaut mission',
        description:
            'Travelers will have a new insight mission to the International Space Station...',
        image: '/assets/section-news/news8.png',
        category: 'Space and Science',
        readTime: '5 mins read',
        body: 'Full article content here...',
        author: 'Space Journalist',
    },
    {
        id: 9,
        title: 'What Is The Importance Of Family In Modern Society?',
        description:
            'With advancements in technology, lifestyles have changed and so have the...',
        image: '/assets/section-news/news9.png',
        category: 'Health and Science',
        readTime: '6 mins read',
        body: 'Full article content here...',
        author: 'Social Reporter',
    },
    {
        id: 10,
        title: 'Some of the Last Giant Pandas in the US are Going Back to China',
        description:
            'Some of the last giant pandas in the US are leaving next month. By the National Zoo in...',
        image: '/assets/section-news/news10.png',
        category: 'Our Planet',
        readTime: '4 mins read',
        body: 'Full article content here...',
        author: 'Wildlife Reporter',
    },
    {
        id: 11,
        title: 'Public Input Sought on State Forest Work Plan Update',
        description:
            'The Maryland Department of Natural Resources is inviting public comment on an operational wood...',
        image: '/assets/section-news/news11.png',
        category: 'Our Planet',
        readTime: '5 mins read',
        body: 'Full article content here...',
        author: 'Environmental Correspondent',
    },
    {
        id: 12,
        title: 'Public Input Sought on State Forest Work Plan Update',
        description:
            'The Maryland Department of Natural Resources is inviting public comment on an operational wood...',
        image: '/assets/section-news/news12.png',
        category: 'Our Planet',
        readTime: '5 mins read',
        body: 'Full article content here...',
        author: 'Environmental Correspondent',
    },
];

export const MOCK_NEWS_DETAIL = {
    title: 'Axiom Space Refines Training for Next Astronauts Mission',
    heroDescription:
        'A American company that The last UK individual to go into orbit was Tim organizes visits to the Peake, who flew to the ISS as a European Space Agency (Esa) astronaut in 2015.\n\nHouston-based Axiom has signed a memorandum of understanding with the UK Space Agency to try to make it happen.\n\nThe project would probably cost £200m or more, but the idea is that it would be funded commercially. There would be no contribution from UK taxpayers. Axiom told the BBC that conversations with corporations and institutions interested in providing finance were already under way.\n\n"This is an exciting opportunity and actually unique," he commented. "No-one has done a \'national mission\', commercially, like this before. It\'s a new model and would be paving the way for how we do space in the future."\n\nDetails are sparse at the moment. No crew has been chosen, not is there a concept yet for how it would be selected.',
    content1:
        'A American company that The last UK individual to go into orbit was Tim organizes visits to the Peake, who flew to the ISS as a European Space Agency (Esa) astronaut in 2015.\n\nHouston-based Axiom has signed a memorandum of understanding with the UK Space Agency to try to make it happen.\n\nThe project would probably cost £200m or more, but the idea is that it would be funded commercially. There would be no contribution from UK taxpayers. Axiom told the BBC that conversations with corporations and institutions interested in providing finance were already under way.\n\n"This is an exciting opportunity and actually unique," he commented. "No-one has done a \'national mission\', commercially, like this before. It\'s a new model and would be paving the way for how we do space in the future."\n\nDetails are sparse at the moment. No crew has been chosen, not is there a concept yet for how it would be selected.',
    content2:
        'A American company that The last UK individual to go into orbit was Tim organizes visits to the Peake, who flew to the ISS as a European Space Agency (Esa) astronaut in 2015.\n\nHouston-based Axiom has signed a memorandum of understanding with the UK Space Agency to try to make it happen.\n\nThe project would probably cost £200m or more, but the idea is that it would be funded commercially. There would be no contribution from UK taxpayers. Axiom told the BBC that conversations with corporations and institutions interested in providing finance were already under way.\n\n"This is an exciting opportunity and actually unique," he commented. "No-one has done a \'national mission\', commercially, like this before. It\'s a new model and would be paving the way for how we do space in the future."\n\nDetails are sparse at the moment. No crew has been chosen, not is there a concept yet for how it would be selected.',
    relatedNews: [
        {
            id: 1,
            image: '/assets/section-news1-cosmos/news-cosmos2.png',
            title: 'New Research Ties Industrial Pollution in Joppa to Higher Rates of Asthma, Respiratory Issues',
            description: '',
        },
        {
            id: 2,
            image: '/assets/section-news1-cosmos/news-cosmos3.png',
            title: 'Wildlife Worldwide Contaminated by Flame Retardants: New Map',
            description:
                'Wild animals across every continent are contaminated with toxic chemicals, according to a new... Read more',
        },
        {
            id: 3,
            image: '/assets/section-news1-cosmos/news-cosmos4.png',
            title: 'Switzerland Sets Its Sights on Combatting Greenwashing in Fina...',
            description:
                "Switzerland's Federal Department of Finance (FDF) has launched its attempt to set tougher regulation... Read more",
        },
        {
            id: 4,
            image: '/assets/section-news1-cosmos/news-cosmos5.png',
            title: 'For years, Japan Tried to Keep Their Existence a Secret, But the...',
            description:
                'Engaged out of his reservation and beaten by... Read more',
        },
        {
            id: 5,
            image: '/assets/section-news1-cosmos/news-cosmos6.png',
            title: 'Prospect of $4 Million a Year for Trash Collection Leaves New Ken...',
            description:
                'New Kensington officials are considering whether to keep trash collection — more than four times what... Read more',
        },
    ],
};

async function handleNewsApiRequest<T>(
    apiCall: () => Promise<{ data: T }>,
): Promise<IApiNewsResponse<T>> {
    try {
        const response = await apiCall();
        return { response: response.data };
    } catch (error: unknown) {
        let errorMessage = 'An error occurred';
        let status: number | undefined;

        if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            };

            status = axiosError.response?.status;

            if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (axiosError.message) {
                errorMessage = axiosError.message;
            }
        }

        switch (status) {
            case 401:
                errorMessage = 'Authentication failed. Please log in again.';
                break;
            case 403:
                errorMessage =
                    'You do not have permission to perform this action.';
                break;
            case 404:
                errorMessage = 'Resource not found.';
                break;
            case 500:
                errorMessage = 'Server error occurred. Please try again later.';
                break;
        }

        return {
            error: {
                message: errorMessage,
                status,
            },
        };
    }
}

export const createNews = async (
    newsData: ICreateNewsRequest,
): Promise<IApiNewsResponse<INewsResponse>> => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('body', newsData.body);
    formData.append('author', newsData.author);

    if (newsData.image instanceof File) {
        formData.append('image', newsData.image);
    }

    return handleNewsApiRequest<INewsResponse>(() =>
        newsApiInstance.post(getApiUrl('/api/news'), formData),
    );
};

export const getAllNews = async (): Promise<
    IApiNewsResponse<INewsResponse[]>
> => {
    try {
        const result = await handleNewsApiRequest<INewsResponse[]>(() =>
            newsApiInstance.get(getApiUrl('/api/news')),
        );

        if (result.error) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        response: mockNews as unknown as INewsResponse[],
                    });
                }, 300);
            });
        }

        return result;
    } catch {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ response: mockNews as unknown as INewsResponse[] });
            }, 300);
        });
    }
};

export const getNewsById = async (
    id: string,
): Promise<IApiNewsResponse<INewsResponse>> => {
    return handleNewsApiRequest<INewsResponse>(() =>
        newsApiInstance.get(getApiUrl(`/api/news/${id}`)),
    );
};

export const updateNews = async (
    id: string,
    newsData: IUpdateNewsRequest,
): Promise<IApiNewsResponse<INewsResponse>> => {
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('body', newsData.body);
    formData.append('author', newsData.author);

    if (newsData.image instanceof File) {
        formData.append('image', newsData.image);
    }

    return handleNewsApiRequest<INewsResponse>(() =>
        newsApiInstance.put(getApiUrl(`/api/news/${id}`), formData),
    );
};

export const deleteNews = async (
    id: string,
): Promise<IApiNewsResponse<{ message: string }>> => {
    return handleNewsApiRequest<{ message: string }>(() =>
        newsApiInstance.delete(getApiUrl(`/api/news/${id}`)),
    );
};

export const getAllNewsLegacy = async (): Promise<INews[]> => {
    const result = await getAllNews();
    if (result.response) {
        return result.response.map((news, index) => ({
            id: parseInt(news._id) || index + 1,
            _id: news._id,
            title: news.title,
            body: news.body,
            author: news.author,
            date: news.date,
            description: news.body.substring(0, 100) + '...',
            image: '/assets/section-news/news1.png',
            category: 'General',
            readTime: '5 mins read',
        }));
    }
    return mockNews;
};

export const getNewsByIdLegacy = async (
    id: number,
): Promise<INews | undefined> => {
    const mockResult = mockNews.find((item) => item.id === id);
    if (mockResult) {
        return mockResult;
    }

    if (id > 0 && id <= mockNews.length) {
        return mockNews[id - 1];
    }

    return mockNews[0];
};
