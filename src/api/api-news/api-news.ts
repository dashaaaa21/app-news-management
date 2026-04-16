import axios from 'axios';
import { getAccessToken } from '../../common/utils/localStorage';
import { getApiUrl } from '../../common/utils/apiConfig';
import type {
    ICreateNewsRequest,
    IUpdateNewsRequest,
    INewsResponse,
    IApiNewsResponse,
} from '../../common/types/news-type';

const newsApiInstance = axios.create({
    headers: { 'Content-Type': 'application/json' },
});

newsApiInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    if (config.data instanceof FormData) delete config.headers['Content-Type'];
    return config;
});

newsApiInstance.interceptors.response.use(
    (r) => r,
    (error) => {
        if (error.response?.status === 401) window.location.href = '/login';
        return Promise.reject(error);
    },
);

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
            const e = error as {
                response?: { status?: number; data?: { message?: string } };
                message?: string;
            };
            status = e.response?.status;
            errorMessage =
                e.response?.data?.message || e.message || errorMessage;
        }
        if (status === 401)
            errorMessage = 'Authentication failed. Please log in again.';
        if (status === 403)
            errorMessage = 'You do not have permission to perform this action.';
        if (status === 404) errorMessage = 'Resource not found.';
        if (status === 500)
            errorMessage = 'Server error. Please try again later.';
        return { error: { message: errorMessage, status } };
    }
}

// compress base64 image to reduce localStorage usage
async function compressImage(
    base64: string,
    maxWidth = 800,
    quality = 0.7,
): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ratio = Math.min(1, maxWidth / img.width);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64);
                return;
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(base64);
        img.src = base64;
    });
}

// strip images from body before saving to main storage, save images separately
const LS_IMAGES_KEY = 'news_images';
const LS_KEY = 'news_local_storage';

function saveImages(id: string, images: Record<string, string>) {
    try {
        const all = JSON.parse(localStorage.getItem(LS_IMAGES_KEY) || '{}');
        all[id] = images;
        localStorage.setItem(LS_IMAGES_KEY, JSON.stringify(all));
    } catch (_e) {
        void _e;
    }
}

function loadImages(id: string): Record<string, string> {
    try {
        const all = JSON.parse(localStorage.getItem(LS_IMAGES_KEY) || '{}');
        return all[id] || {};
    } catch {
        return {};
    }
}

function deleteImages(id: string) {
    try {
        const all = JSON.parse(localStorage.getItem(LS_IMAGES_KEY) || '{}');
        delete all[id];
        localStorage.setItem(LS_IMAGES_KEY, JSON.stringify(all));
    } catch (_e) {
        void _e;
    }
}

async function stripAndSaveImages(id: string, body: string): Promise<string> {
    try {
        const blocks = JSON.parse(body);
        if (!Array.isArray(blocks)) return body;

        const images: Record<string, string> = {};
        const stripped = await Promise.all(
            blocks.map(
                async (block: {
                    type: string;
                    id: string;
                    content?: string;
                }) => {
                    if (
                        block.type === 'image-placeholder' &&
                        block.content?.startsWith('data:')
                    ) {
                        const compressed = await compressImage(block.content);
                        images[block.id] = compressed;
                        return { ...block, content: `__img__${block.id}` };
                    }
                    return block;
                },
            ),
        );

        if (Object.keys(images).length > 0) {
            saveImages(id, images);
        }

        return JSON.stringify(stripped);
    } catch {
        return body;
    }
}

function restoreImages(id: string, body: string): string {
    try {
        const blocks = JSON.parse(body);
        if (!Array.isArray(blocks)) return body;
        const images = loadImages(id);
        const restored = blocks.map(
            (block: { type: string; id: string; content?: string }) => {
                if (
                    block.type === 'image-placeholder' &&
                    block.content?.startsWith('__img__')
                ) {
                    const imgId = block.content.replace('__img__', '');
                    return { ...block, content: images[imgId] || '' };
                }
                return block;
            },
        );
        return JSON.stringify(restored);
    } catch {
        return body;
    }
}

function lsGetAll(): INewsResponse[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        if (!Array.isArray(parsed)) return [];
        return parsed
            .filter((i) => i && i._id)
            .map((i) => ({ ...i, body: restoreImages(i._id, i.body) }));
    } catch {
        return [];
    }
}

export function getLocalNews(): INewsResponse[] {
    return lsGetAll();
}

function lsSaveRaw(items: INewsResponse[]) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch (e: unknown) {
        if (e instanceof Error && e.name === 'QuotaExceededError') {
            const trimmed = items.slice(0, Math.floor(items.length / 2));
            try {
                localStorage.setItem(LS_KEY, JSON.stringify(trimmed));
            } catch (_e) {
                void _e;
            }
        }
    }
}

async function lsCreate(data: ICreateNewsRequest): Promise<INewsResponse> {
    const id = `local_${Date.now()}`;
    const strippedBody = await stripAndSaveImages(id, data.body);
    const item: INewsResponse = {
        _id: id,
        title: data.title,
        body: strippedBody,
        author: data.author,
        date: new Date().toISOString(),
        __v: 0,
    };
    const items = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(
        (i: INewsResponse) => i && i._id,
    );
    lsSaveRaw([item, ...items]);
    return { ...item, body: restoreImages(id, strippedBody) };
}

async function lsUpdate(
    id: string,
    data: IUpdateNewsRequest,
): Promise<INewsResponse | null> {
    const items = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(
        (i: INewsResponse) => i && i._id,
    );
    const idx = items.findIndex((i: INewsResponse) => i._id === id);
    const strippedBody = await stripAndSaveImages(id, data.body);
    const updated: INewsResponse =
        idx !== -1
            ? {
                  ...items[idx],
                  title: data.title,
                  body: strippedBody,
                  author: data.author,
              }
            : {
                  _id: id,
                  title: data.title,
                  body: strippedBody,
                  author: data.author,
                  date: new Date().toISOString(),
                  __v: 0,
              };
    if (idx !== -1) items[idx] = updated;
    else items.unshift(updated);
    lsSaveRaw(items);
    return { ...updated, body: restoreImages(id, strippedBody) };
}

function lsDelete(id: string) {
    const items = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(
        (i: INewsResponse) => i && i._id && i._id !== id,
    );
    lsSaveRaw(items);
    deleteImages(id);
}

export const getAllNews = async (): Promise<
    IApiNewsResponse<INewsResponse[]>
> => {
    const result = await handleNewsApiRequest<INewsResponse[]>(() =>
        newsApiInstance.get(getApiUrl('/api/news')),
    );

    if (result.error) {
        return { response: lsGetAll() };
    }

    const serverItems = result.response || [];
    const localOnly = lsGetAll().filter((l) => l._id?.startsWith('local_'));
    const serverIds = new Set(serverItems.map((i) => i._id));
    const merged = [
        ...serverItems,
        ...localOnly.filter((l) => !serverIds.has(l._id)),
    ];

    const rawItems = JSON.parse(localStorage.getItem(LS_KEY) || '[]').filter(
        (i: INewsResponse) => i && i._id,
    );
    const localOnlyRaw = rawItems.filter((i: INewsResponse) =>
        i._id?.startsWith('local_'),
    );
    lsSaveRaw([
        ...serverItems,
        ...localOnlyRaw.filter((l: INewsResponse) => !serverIds.has(l._id)),
    ]);

    return { response: merged };
};

export const getNewsById = async (
    id: string,
): Promise<IApiNewsResponse<INewsResponse>> => {
    if (id?.startsWith('local_')) {
        const item = lsGetAll().find((i) => i._id === id);
        return item ? { response: item } : { error: { message: 'Not found' } };
    }
    const result = await handleNewsApiRequest<INewsResponse>(() =>
        newsApiInstance.get(getApiUrl(`/api/news/${id}`)),
    );
    if (result.error) {
        const item = lsGetAll().find((i) => i._id === id);
        return item ? { response: item } : result;
    }
    return result;
};

export const createNews = async (
    newsData: ICreateNewsRequest,
): Promise<IApiNewsResponse<INewsResponse>> => {
    const result = await handleNewsApiRequest<INewsResponse>(() =>
        newsApiInstance.post(getApiUrl('/api/news'), {
            title: newsData.title,
            body: newsData.body,
            author: newsData.author,
        }),
    );

    if (result.error) {
        const item = await lsCreate(newsData);
        return { response: item };
    }

    if (result.response) {
        const item = await lsCreate({
            ...newsData,
            body: result.response.body || newsData.body,
        });
        return { response: { ...result.response, body: item.body } };
    }

    return result;
};

export const updateNews = async (
    id: string,
    newsData: IUpdateNewsRequest,
): Promise<IApiNewsResponse<INewsResponse>> => {
    if (id?.startsWith('local_')) {
        const item = await lsUpdate(id, newsData);
        return item ? { response: item } : { error: { message: 'Not found' } };
    }

    const result = await handleNewsApiRequest<INewsResponse>(() =>
        newsApiInstance.put(getApiUrl(`/api/news/${id}`), {
            title: newsData.title,
            body: newsData.body,
            author: newsData.author,
        }),
    );

    const item = await lsUpdate(id, newsData);
    if (item) return { response: item };
    return result;
};

export const deleteNews = async (
    id: string,
): Promise<IApiNewsResponse<{ message: string }>> => {
    lsDelete(id);
    if (id?.startsWith('local_')) {
        return { response: { message: 'Deleted' } };
    }
    const result = await handleNewsApiRequest<{ message: string }>(() =>
        newsApiInstance.delete(getApiUrl(`/api/news/${id}`)),
    );
    return result.error ? { response: { message: 'Deleted locally' } } : result;
};

export const MOCK_NEWS_DETAIL = {
    title: 'Axiom Space Refines Training for Next Astronauts Mission',
    heroDescription:
        'Houston-based Axiom has signed a memorandum of understanding with the UK Space Agency to try to make it happen.',
    content1:
        'The project would probably cost £200m or more, but the idea is that it would be funded commercially.',
    content2:
        'Details are sparse at the moment. No crew has been chosen, nor is there a concept yet for how it would be selected.',
    relatedNews: [
        {
            id: 1,
            image: '/assets/section-news1-cosmos/news-cosmos2.png',
            title: 'New Research Ties Industrial Pollution to Higher Rates of Asthma',
            description: '',
        },
        {
            id: 2,
            image: '/assets/section-news1-cosmos/news-cosmos3.png',
            title: 'Wildlife Worldwide Contaminated by Flame Retardants: New Map',
            description:
                'Wild animals across every continent are contaminated with toxic chemicals... Read more',
        },
        {
            id: 3,
            image: '/assets/section-news1-cosmos/news-cosmos4.png',
            title: 'Switzerland Sets Its Sights on Combatting Greenwashing',
            description:
                "Switzerland's Federal Department of Finance has launched tougher regulation... Read more",
        },
        {
            id: 4,
            image: '/assets/section-news1-cosmos/news-cosmos5.png',
            title: 'For years, Japan Tried to Keep Their Existence a Secret',
            description:
                'Engaged out of his reservation and beaten by... Read more',
        },
        {
            id: 5,
            image: '/assets/section-news1-cosmos/news-cosmos6.png',
            title: 'Prospect of $4 Million a Year for Trash Collection',
            description:
                'New Kensington officials are considering whether to keep trash collection... Read more',
        },
    ],
};

export const getNewsByIdLegacy = async (
    id: number,
): Promise<import('../../common/types/news-type').INews | undefined> => {
    const result = await getNewsById(String(id));
    if (result.response) {
        return {
            id,
            _id: result.response._id,
            title: result.response.title,
            body: result.response.body,
            author: result.response.author,
            date: result.response.date,
        };
    }
    return undefined;
};
