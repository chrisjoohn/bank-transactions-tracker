import type { Meta, StoryObj } from '@storybook/react';

import NavigationBar from './NavigationBar';

const meta = {
  title: 'Organisms/Navigation Bar',
  component: NavigationBar,
  parameters: {},
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const commonArgs = {
  pillGroupProps: {
    pills: [
      {
        label: 'Dashboard',
        active: true,
      },
      {
        label: 'Accounts',
      },
      {
        label: 'Reports',
      },
    ],
  },
  logo: 'Test',
  avatarProps: {
    imgSrc:
      'https://lh3.googleusercontent.com/a/ACg8ocL7WuvhQchy5AxBSS45UtdRa77eJzUzzE9pOMwz06UtyU5wfA=s96-c',
    altTxt: 'CM',
  },
};

const commonStyles = {
  boxShadow:
    'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
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
  ],
};

export const Vertical: Story = {
  args: { ...commonArgs, orientation: 'vertical' },
  decorators: [
    (Story) => {
      return (
        <div style={{ ...commonStyles, height: 'calc(100vh - 2rem)', width: '20%' }}>
          <Story />
        </div>
      );
    },
  ],
};
