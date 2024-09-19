import type { Meta, StoryObj } from '@storybook/react';

import PillGroup from './PillGroup';

const meta = {
  title: 'Molecules/Pill Group',
  component: PillGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PillGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const pillLabels = ['Dashboard', 'Accounts', 'Reports'];

export const Base: Story = {
  args: {
    pills: pillLabels.map((item) => ({
      label: item,
      onClick: () => alert(item),
    })),
  },
};
