import { FC } from 'react';

import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Line,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

type AnalyticData = {
  title: string;
  description?: string;
  chartType: string;
  dimensions: string[];
  data: {
    [key: string]: string | number;
  }[];
  metrics: { key: string; label: string; fill?: string }[];
};

export type AnalyticsData = AnalyticData[];

export interface DynamicAnalyticsProps {
  data: AnalyticsData;
}

const BTTLineChart: FC<{
  data: { [key: string]: string }[];
  metrics: { label: string; key: string }[];
  xKey: string;
}> = (props) => {
  const { data, xKey, metrics } = props;
  return (
    <LineChart data={data} height={300} width={700}>
      <CartesianGrid strokeDasharray={'3 3'} />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      {metrics.map((metric) => {
        return <Line type={'monotone'} dataKey={metric.key} name={metric.label} />;
      })}
    </LineChart>
  );
};

const BTTBarChart: FC<{
  item: AnalyticData;
}> = (props) => {
  const { item } = props;
  const xKey = item.dimensions[0];

  const data = item.data.map((data) => {
    const obj: { [key: string]: any } = { name: data[xKey] };
    item.metrics.forEach((metric) => {
      if (data[metric.key] !== null) {
        obj[metric.key] = data[metric.key];
      }
    });

    return obj;
  });
  return (
    <BarChart data={data} height={300} width={700}>
      <CartesianGrid strokeDasharray={'3 3'} />
      <XAxis dataKey={item.dimensions[0]} />
      <YAxis />
      <Tooltip />
      <Legend />
      {item.metrics.map((metric) => {
        return <Bar type="monotone" dataKey={metric.key} name={metric.label} fill={metric.fill} />;
      })}
    </BarChart>
  );
};

const DynamicAnalytics: FC<DynamicAnalyticsProps> = (props) => {
  const { data } = props;

  return data.map((item) => {
    switch (item.chartType) {
      case 'bar':
        return <BTTBarChart item={item} />;

      case 'line':
      default:
        const xKey = item.dimensions[0];

        const lineChartData = item.data.map((data) => {
          const obj: { [key: string]: any } = { name: data[xKey] };
          item.metrics.forEach((metric) => {
            if (data[metric.key] !== null) {
              obj[metric.key] = data[metric.key];
            }
          });

          return obj;
        });

        return <BTTLineChart data={lineChartData} xKey={xKey} metrics={item.metrics} />;
    }
  });
};

export default DynamicAnalytics;
