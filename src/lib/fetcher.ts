export class HTTPError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export const fetcherWithAuthorization = async <T>(key: string, options?: ResponseInit): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  });

  if (options?.headers) {
    const incomingHeaders = new Headers();
    incomingHeaders.forEach((value, key) => headers.append(key, value));
  }

  const res = await fetch(
    key,
    { method: 'POST', headers, ...options, credentials: 'same-origin' }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new HTTPError('fetcherError', data, res.status);
  }

  return data;
};

export const fetcherWithSWRMutation = async <T>(key: string, { arg }: { arg: Record<string, string> }): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json'
  });

  const res = await fetch(
    key + new URLSearchParams(arg),
    { method: 'POST', headers, credentials: 'same-origin' }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new HTTPError('fetcherError', data, res.status);
  }

  return data;
};
