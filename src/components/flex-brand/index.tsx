import { memo } from 'react';

export const FlexLogo = memo(({ size }: { size: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 132 132">
    <path d="M123.1 32.9L65.9 0 8.8 33.1 8.9 99.1 18.1 104.4 18.1 93.7 18 93.6 18.1 38.2 66.1 10.6 114 38.4 113.9 93.8 65.9 121.4 45.8 109.7 45.8 77.6 66 89.4 66 66 45.7 54.3 66.1 42.7 86.2 54.3 104.7 43.7 66 21.3 27.3 43.7 27.3 99 27.3 99.1 27.3 109.7 66.1 132 123.2 98.9z" />
  </svg>
));

if (process.env.NODE_ENV !== 'production') {
  FlexLogo.displayName = 'FlexLogo';
}
