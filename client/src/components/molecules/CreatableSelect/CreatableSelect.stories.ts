import type { Meta, StoryObj } from '@storybook/react';

import CreatableSelect from './CreatableSelect';

import type { SelectProps } from 'antd';

const meta = {
  title: 'Molecules/Creatable Select',
  component: CreatableSelect,
  parameters: {
    layout: 'centered',
    innerWidth: 400,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CreatableSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const strOptions = ['Food', 'Leisure', 'Essentials'];

const baseOptions: SelectProps['options'] = strOptions.map((label, idx) => {
  return {
    label,
    value: JSON.stringify({
      name: label,
      id: idx,
    }),
  };
});

export const Base: Story = {
  args: {
    options: baseOptions,
    value: [],
  },
};

export const WithValue: Story = {
  args: {
    options: baseOptions,
    value: [baseOptions[0]],
  },
};
