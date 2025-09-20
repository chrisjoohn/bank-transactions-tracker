import { FC, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CashflowLineChart: FC = () => {
  // Process accountTransactions to get inflow and outflow data
  // This is a placeholder; replace with actual logic to compute inflow and outflow

  /**
   * Sample payload to generate this data
   *  POST /api/transactions/cashflow
   *  {
   *   "account_id": "account_unique_code",
   *   "filters": {
   *     "start_date": "2023-01-01",
   *     "end_date": "2023-12-31",
   *     "filter_type": "month" // or "quarter", "year"
   *   },
   *   "fields": ["inflow", "outflow", "total"] // optional, default to all
   *  }
   *
   * Sample response
   *  {
   *    shape: { xKeys: ['date'], yKeys: ['inflow', 'outflow', 'total'] },
   *    data: [
   *     { date: '2023-01-01', inflow: 1000, outflow: 500, total: 400 },
   *     { date: '2023-02-01', inflow: 1500, outflow: 700, total: 300 },
   *       ...
   *    ]
   *  }
   */

  const sampleResponse = {
    shape: {
      xKeys: [{ key: 'date', name: 'Date' }],
      yKeys: [
        { key: 'inflow', name: 'Inflow' },
        { key: 'outflow', name: 'Outflow' },
        { key: 'total', name: 'Total' },
      ],
    },
    data: [
      { date: '2023-01-01', inflow: 1000, outflow: 500, total: 400 },
      { date: '2023-02-01', inflow: 1500, outflow: 700, total: 300 },
      { date: '2023-02-05', inflow: 1500, outflow: 700, total: 1000 },
      { date: '2023-02-06', inflow: 1500, outflow: 700, total: 900 },
      { date: '2023-02-02', inflow: 1500, outflow: 700, total: 750 },
      // Add more data points as needed
    ],
  };

  const { shape, data } = sampleResponse;

  const colorMap = {
    inflow: '#82ca9d',
    outflow: '#ff6961',
    total: '#8884d8',
  };

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <LineChart width={500} height={200} data={data}>
        {/* <CartesianGrid strokeDasharray="5 5" /> */}
        {shape.xKeys.map((xKey) => {
          return <XAxis key={xKey.key} dataKey={xKey.key} />;
        })}
        <YAxis />
        <Tooltip />
        {shape.yKeys.map((yKey) => {
          return (
            <Line
              key={yKey.key}
              dataKey={yKey.key}
              name={yKey.name}
              type={'bump'}
              stroke={colorMap[yKey.key] || '#000000'}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CashflowLineChart;
