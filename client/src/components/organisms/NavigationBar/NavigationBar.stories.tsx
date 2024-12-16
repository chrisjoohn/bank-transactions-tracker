import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import NavigationBar, { NavigationBarProps } from './NavigationBar';

const meta = {
  title: 'Organisms/Navigation Bar',
  component: NavigationBar,
  parameters: {},
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs: NavigationBarProps = {
  navItems: [
    {
      label: 'Dashboard',
      path: '/',
    },
    {
      label: 'Accounts',
      path: '/accounts',
    },
    {
      label: 'Reports',
      path: '/reports',
    },
  ],

  avatarImg:
    'https://lh3.googleusercontent.com/a/ACg8ocL7WuvhQchy5AxBSS45UtdRa77eJzUzzE9pOMwz06UtyU5wfA=s96-c',
  avatarImgAlt: 'CM',
  logo: 'Test',
};

const commonStyles = {
  boxShadow:
    'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
};

const RouterDecorator = (Story: any) => {
  return (
    <MemoryRouter>
      <Routes>
        <Route
          path='/'
          element={<Story />}
        />
        <Route
          path='/accounts'
          element={<Story />}
        />
        <Route
          path='/reports'
          element={<Story />}
        />
      </Routes>
    </MemoryRouter>
  );
};

export const Base: Story = {
  args: commonArgs,
  decorators: [
    (Story) => {
      return (
        <div style={{ ...commonStyles }}>
          <Story />
        </div>
      );
    },
    RouterDecorator,
  ],
};

export const Vertical: Story = {
  args: { ...commonArgs, orientation: 'vertical' },
  decorators: [
    (Story) => {
      return (
        <div
          style={{
            ...commonStyles,
            height: 'calc(100vh - 2rem)',
            width: '20%',
          }}
        >
          <Story />
        </div>
      );
    },
    RouterDecorator,
  ],
};
