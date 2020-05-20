export const BASE_URL = '/arbeidsgiver-permittering';

export const isProduction = (): string =>
    process.env.NODE_ENV === 'production' ? '' : 'http://127.0.0.1:3001';

const fetchdata: (url: string) => Promise<Response> = (url) => {
    return fetch(url, { method: 'GET' });
};

export const fetchsanityJSON = async (url: string) => {
    const response = await fetchdata(`${url}${BASE_URL}/innhold`);
    await status(response);
    return await response.json();
};

function status(response: Response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
