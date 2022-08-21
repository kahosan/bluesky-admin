import { Breadcrumbs, Link, Popover, Text, useTheme, useToasts } from '@geist-ui/core';
import Tool from '@geist-ui/icons/tool';

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu, MenuItem } from '../menu';
import { Container } from '../container';
import { ThemeToggle } from './toggle-theme';

import { useFlexApiToken } from '@/hooks/use-flex-api-token';
import { useIsCompany } from '@/hooks/use-is-company';
import { useBreadCrumb } from '@/hooks/use-bread-crumb';

export const AvatarMenu = (props: { name: string }) => {
  const [, setFlexToken] = useFlexApiToken();
  const [, setIsCompanyToken] = useIsCompany();

  const { setToast } = useToasts();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setFlexToken(null);
    setIsCompanyToken(null);

    setToast({
      type: 'success',
      text: '你已经成功退出',
      delay: 3000
    });
    navigate('/login');
  }, [setFlexToken, setIsCompanyToken, navigate, setToast]);

  const handleLogoutClick = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      <Menu
        content={
          <>
            <MenuItem>
              <Link href="/">Dashboard</Link>
            </MenuItem>
            <MenuItem>
              <Link
                href="https://github.com/kahosan/bluesky-admin"
                target="_blank"
                rel="external"
              >
                Source Code
              </Link>
            </MenuItem>
            <Popover.Item line />
            <ThemeToggle />
            <Popover.Item line />
            <MenuItem>
              <Text span onClick={handleLogoutClick}>Log Out</Text>
            </MenuItem>
          </>
        }
      >
        {<img
          alt={`${props?.name}'s Avatar`}
          style={{
            borderRadius: '50%',
            userSelect: 'none',
            cursor: 'pointer'
          }}
          src="https://api.vercel.com/www/avatar/69ce0f958983e8750d3b0b3f846f1d391f1e1d3f"
          height={36}
          width={36}
        />
        }
      </Menu>
    </>
  );
};

export const Layout = (props: { name: string; children: React.ReactNode }) => {
  const theme = useTheme();
  const [breadCrumb] = useBreadCrumb();

  return (
    <>
      <div
        style={{ backgroundColor: theme.palette.background }}
        className='h-16 shadow-[0_0_15px_0_rgba(0_0_0_0.1)] z-999 fixed top-0 right-0 left-0'
      >
        <nav className='h-64px'>
          <div
            style={{ maxWidth: `${theme.layout.pageWidthWithMargin}`, padding: `0 ${theme.layout.gap}` }}
            className='flex items-center content-between h-100% my-0 mx-auto select-none'
          >
            <div className='flex flex-1 items-center content-start'>
              <Breadcrumbs className='!text-1.2rem'>
                <Breadcrumbs.Item href='/'><Tool size='28px' color={theme.palette.accents_8}/></Breadcrumbs.Item>
                {breadCrumb.map(item => (
                  <Breadcrumbs.Item key={item.id} href={item.href}>{item.label}</Breadcrumbs.Item>
                ))}
              </Breadcrumbs>
            </div>
            <AvatarMenu name={props.name} />
          </div>
        </nav>
      </div>
      <Container maxWidth={theme.layout.pageWidthWithMargin} className='mt-64px min-h-[calc(100vh-64px)]'>
        {props.children}
      </Container>
    </>
  );
};
