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

export const Base: Story = {
  args: {
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
  },
};
