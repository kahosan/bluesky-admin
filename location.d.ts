import type { Path} from 'react-router-dom';

declare module 'react-router-dom' {
  interface GenericLocation<T> extends Path {
    state: T;
    key: string;
  }

  function useLocation<T>(): GenericLocation<T>;
}
