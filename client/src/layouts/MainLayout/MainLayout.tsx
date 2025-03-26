import { FC } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import type { MenuProps } from 'antd';
import { Menu, Layout } from 'antd';

import classNames from 'classnames';

import './mainLayout.styles.scss';

export type MainLayoutProps = {};

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'accounts',
    label: 'Accounts',
  },
  {
    key: 'reports',
    label: 'Reports',
  },
  {
    key: 'transactions',
    label: 'Transactions',
  },
];

const MainLayout: FC<MainLayoutProps> = (props) => {
  const navigate = useNavigate();
  return (
    <Layout className={classNames('btt-main-layout')}>
      <Layout.Sider width={250}>
        <div className={classNames('navigation')}>
          <Menu
            items={menuItems}
            mode="inline"
            onClick={(item) => {
              if (item.key === 'accounts') {
                navigate('/');
                return;
              }
              navigate(item.key);
            }}
          />
        </div>
      </Layout.Sider>
      <Layout.Content className={classNames('main-content')}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default MainLayout;
