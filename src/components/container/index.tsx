import { useTheme } from '@geist-ui/core';
import type React from 'react';

interface ContainerProps {
  children: React.ReactNode
  maxWidth: string
}

export const Container = ({
  children,
  maxWidth,
  ...rest
}: ContainerProps & JSX.IntrinsicElements['section']) => {
  const theme = useTheme();
  return (
    <section
      style={{
        paddingTop: theme.layout.pageMargin,
        paddingBottom: theme.layout.pageMargin,
        paddingLeft: theme.layout.gap,
        paddingRight: theme.layout.gap,
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth
      }}
      {...rest}
    >
      {children}
    </section>
  );
};
