import type { Meta, StoryObj } from '@storybook/react';

import Avatar from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    imgSrc:
      'https://lh3.googleusercontent.com/a/ACg8ocL7WuvhQchy5AxBSS45UtdRa77eJzUzzE9pOMwz06UtyU5wfA=s96-c',
    altTxt: 'CM', // initials
    onClick: () => alert('Test'),
  },
};
