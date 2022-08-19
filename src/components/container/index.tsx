import { useTheme } from '@geist-ui/core';

interface ContainerProps {
  children: JSX.Element
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
