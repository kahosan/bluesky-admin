export class HTTPError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

interface AuthorizationData {
  key: string;
  token: string;
}

export const fetcherWithAuthorizationOnFlex = async <T>({
  key,
  token,
}: AuthorizationData): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  const res = await fetch(new URL(key, 'https://flex-proxy.kahosan.workers.dev'), {
    method: 'POST',
    headers,
  });

  const data = res.headers.get('content-type')?.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new HTTPError(
      data.message || 'An error occurred while fetching the data',
      data,
      res.status
    );
  }

  return data;
};

export const fetcherWithLoginForFlex = async <T>(
  client_id: string,
  client_secret: string
): Promise<T> => {
  const body = new URLSearchParams({
    scope: 'fbox',
    client_id,
    client_secret,
    grant_type: 'client_credentials',
  });

  const res = await fetch('https://flex-proxy.kahosan.workers.dev/idserver/core/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new HTTPError(
      data.message || 'An error occurred while fetching the data',
      data,
      res.status
    );
  }

  return data;
};

export const fetcherWithLoginForCompany = async <T>(
  username: string,
  password: string
): Promise<T> => {
  const res = await fetch('http://localhost:8080/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new HTTPError(
      data.message || 'An error occurred while fetching the data',
      data,
      res.status
    );
  }

  return data;
};
