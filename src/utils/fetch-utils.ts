import { DocumentTypes } from '../komponenter/ContextProvider';

interface Innhold {
    data: DocumentTypes[];
    env: string[];
}

export const BASE_URL = '/arbeidsgiver-permittering';

export const isProduction = (): string =>
    process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';

const fetchdata: (url: string) => Promise<Response> = (url) => {
    return fetch(url, { method: 'GET' });
};

export const fetchsanityJSON = async (url: string): Promise<Innhold> => {
    const response = await fetchdata(`${url}${BASE_URL}/innhold`);
    await status(response);
    return response.json();
};

function status(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
