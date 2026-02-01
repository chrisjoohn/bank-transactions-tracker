import { FC } from 'react';

import { Card } from 'antd';
import {
  Line,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  LineChart,
  PieChart,
} from 'recharts';

import type { ChartData } from '../TagChartsRenderer';

export interface ChartRendererProps {
  chartData: ChartData;
}

const ChartRenderer: FC<ChartRendererProps> = ({ chartData }) => {
  const { title, chartType, data, series } = chartData;

  const defaultXKey = { tagName: 'Period', key: 'period' };

  switch (chartType) {
    case 'bar':
      return (
        <Card style={{ width: '50%' }}>
          {title}
          <ResponsiveContainer width={'100%'} height={300}>
            <BarChart width={500} height={200} data={data}>
              {defaultXKey && <XAxis dataKey={defaultXKey.key} name={defaultXKey.tagName} />}
              <YAxis />
              <Tooltip />
              {series.map((yKey) => (
                <Bar
                  key={yKey.tagId}
                  dataKey={yKey.tagId}
                  name={yKey.tagName}
                  fill={yKey.style.color}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      );
    case 'line':
      return (
        <Card style={{ width: '50%' }}>
          {title}
          <ResponsiveContainer width={'100%'} height={300}>
            <LineChart width={500} height={200} data={data}>
              {defaultXKey && <XAxis dataKey={defaultXKey.key} name={defaultXKey.tagName} />}
              <YAxis />
              <Tooltip />
              {series.map((yKey) => (
                <Line
                  key={yKey.tagId}
                  type="monotone"
                  dataKey={yKey.tagId}
                  name={yKey.tagName}
                  stroke={yKey.style.color}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      );
    case 'pie': // TODO: this is still not functional
      return (
        <Card style={{ width: '50%' }}>
          {title}
          <ResponsiveContainer width={'100%'} height={300}>
            <PieChart width={500} height={200}></PieChart>
          </ResponsiveContainer>
        </Card>
      );
    default:
      break;
  }
};

export default ChartRenderer;
