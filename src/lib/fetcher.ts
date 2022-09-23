export class HTTPError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export const fetcherWithAuthorizationForCompany = async <T>(key: string, options?: ResponseInit): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  });

  if (options?.headers) {
    const incomingHeaders = new Headers();
    incomingHeaders.forEach((value, key) => headers.append(key, value));
  }

  const res = await fetch(
    new URL(key, 'http://localhost:8080'),
    { method: 'POST', headers, ...options, credentials: 'include' }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new HTTPError('fetcherError', data, res.status);
  }

  return data;
};
