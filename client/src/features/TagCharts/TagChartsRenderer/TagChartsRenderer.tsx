import { FC } from 'react';

import ChartRenderer from './ChartRenderer';

export interface TagChartsRendererProps {
  accountId: string;
}

// NOTE: this would be the shape to be returned by the API
export interface ChartData {
  title: string;
  chartType: string;
  data: { [key: string]: string | number }[];
  preFilter?: {
    mainTag?: string;
  };
  shape: {
    yKeys: {
      tagId: string;
      tagName: string;
      alias?: string;
      style: {
        color: string;
      };
    }[];
  };
}

// TODO: maybe add style on the shape?
const sampleData: ChartData[] = [
  {
    title: 'Living expenses',
    chartType: 'bar',
    data: [
      {
        period: '2023-01-01', // TODO: maybe we can update this one to just be date which is by default included on the list
        rent: 1000,
        groceries: 300,
        utilities: 150,
      },
      {
        period: '2023-02-01',
        rent: 1000,
        groceries: 320,
        utilities: 140,
      },
      {
        period: '2023-03-01',
        rent: 1000,
        groceries: 310,
        utilities: 160,
      },
    ],
    shape: {
      yKeys: [
        { tagId: 'rent', tagName: 'Rent', style: { color: '#8884d8' } },
        { tagId: 'groceries', tagName: 'Groceries', style: { color: '#82ca9d' } },
        { tagId: 'utilities', tagName: 'Utilities', style: { color: '#ffc658' } },
      ],
    },
  },
  {
    title: 'Income',
    chartType: 'line',
    data: [
      {
        period: '2023-01-01',
        salary: 4000,
        freelance: 800,
      },
      {
        period: '2023-02-01',
        salary: 4000,
        freelance: 600,
      },
      {
        period: '2023-03-01',
        salary: 4000,
        freelance: 900,
      },
    ],
    shape: {
      yKeys: [
        { tagId: 'salary', tagName: 'Salary', style: { color: '#8884d8' } },
        { tagId: 'freelance', tagName: 'Freelance', style: { color: '#82ca9d' } },
      ],
    },
  },
  {
    title: 'Food',
    chartType: 'bar',
    data: [
      {
        period: '2023-01-01',
        groceries: 600,
        dining_out: 200,
        coffee: 100,
      },
      {
        period: '2023-02-01',
        groceries: 650,
        dining_out: 180,
        coffee: 120,
      },
      {
        period: '2023-03-01',
        groceries: 620,
        dining_out: 220,
        coffee: 90,
      },
    ],
    shape: {
      yKeys: [
        { tagId: 'groceries', tagName: 'Groceries', style: { color: '#8884d8' } },
        { tagId: 'dining_out', tagName: 'Dining Out', style: { color: '#82ca9d' } },
        { tagId: 'coffee', tagName: 'Coffee', style: { color: '#ffc658' } },
      ],
    },
  },
];

// NOTE: shape of the payload to be sent to backend when fetching chart data
type sampleChartPayload = {
  account_id: string;
  filters: {
    date_range: {
      start_date: string; // ISO date string
      end_date: string; // ISO date string
    };
  };
};


const TagChartsRenderer: FC<TagChartsRendererProps> = (props) => {
  const { accountId } = props;

  return sampleData.map((chart, index) => {
    return <ChartRenderer key={index} chartData={chart} />;
  });
};

export default TagChartsRenderer;
