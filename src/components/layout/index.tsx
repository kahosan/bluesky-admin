import { Link, Popover, Tabs, Text, useTheme, useToasts } from '@geist-ui/core';
import { Github, Mail } from '@geist-ui/icons';

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu, MenuItem } from '../menu';
import { Container } from '../container';
import { NavLink } from '../nav-link';
import { FlexLogo } from '../flex-brand';
import { ThemeToggle } from './toggle-theme';

import { useFlexApiToken } from '@/hooks/use-flex-api-token';
import { useIsCompany } from '@/hooks/use-is-company';

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
    <div className='flex items-center children:!ml-3'>
      <Link href='mailto:kahosan@outlook.com'>
        <Mail size='18'/>
      </Link>
      <Link href="https://github.com/kahosan" target='_blank' rel='external'>
        <Github size='18'/>
      </Link>
      <Menu
        content={
          <>
            <MenuItem>
              <NavLink to="/">Dashboard</NavLink>
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
        <img
          alt={`${props?.name}'s Avatar`}
          style={{
            borderRadius: '50%',
            userSelect: 'none',
            cursor: 'pointer',
            border: '1px solid #eaeada'
          }}
          src="https://api.vercel.com/www/avatar/69ce0f958983e8750d3b0b3f846f1d391f1e1d3f"
          height={40}
          width={40}
        />
      </Menu>
    </div>
  );
};

export const Layout = (props: { name: string; children: React.ReactNode }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [isCompany] = useIsCompany();

  enum routeWithCompany {
    '/company/index' = 1,
    '/company/rootcloud'
    // todo
  }

  const handleTabsChange = useCallback((id: string) => {
    switch (id) {
      case '1':
        navigate(routeWithCompany['1']);
        break;
      case '2':
        navigate(routeWithCompany['2']);
        break;
      default:
        console.warn('route is not found, id: ', id);
        break;
    }
  }, [routeWithCompany, navigate]);

  return (
    <>
      <div
        style={{
          backgroundColor: theme.palette.background,
          boxShadow: `0 1px 2px ${theme.palette.accents_2}`
        }}
        className='h-16 z-999 fixed top-0 right-0 left-0'
      >
        <nav className='h-64px'>
          <div
            style={{ maxWidth: `${theme.layout.pageWidthWithMargin}`, padding: `0 ${theme.layout.gap}` }}
            className='flex items-center content-between h-100% my-0 mx-auto select-none'
          >
            <div className='flex flex-1 items-baseline content-start'>
              {
                isCompany
                  ? (<Tabs initialValue='1' hideBorder hideDivider leftSpace='0' className='flex children:!overflow-unset' onChange={id => handleTabsChange(id) }>
                    <Tabs.Item label='Ezviz' value='1'/>
                    <Tabs.Item label='RootCloud' value='2'/>
                  </Tabs>)
                  : <FlexLogo size='24' />
              }
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
