import type { Meta, StoryObj } from '@storybook/react';

import Pill from './Pill';

const meta = {
  title: 'Atoms/Pill',
  component: Pill,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Pill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    label: 'Dashboard',
  },
};


export const Active: Story = {
  args: {
    label: 'Dashboard',
    active: true,
  }
}