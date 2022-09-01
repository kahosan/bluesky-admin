export class HTTPError extends Error {
  info: unknown;
  status: number;

  constructor(message: string, info: unknown, status: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export const fetcherWithLoginForFlex = async <T>(
  client_id: string,
  client_secret: string
): Promise<T> => {
  const body = new URLSearchParams({
    scope: 'fbox',
    client_id,
    client_secret,
    grant_type: 'client_credentials'
  });

  const res = await fetch('https://flex-proxy.kahosan.workers.dev/idserver/core/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
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
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
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
