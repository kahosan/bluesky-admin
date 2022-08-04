import type { CompanyUser, FlexUser } from '@/types/user';

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
  options: FlexUser | CompanyUser;
}

export const fetcherWithAuthorizationOnFlex = async <T>({
  key,
  options,
}: AuthorizationData): Promise<T> => {
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
  });
  const baseURL = `https://flex-proxy.kahosan.workers.dev`;
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(options)) {
    body.append(key, value);
  }

  const res = await fetch(new URL(key, baseURL), {
    method: 'POST',
    body,
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
