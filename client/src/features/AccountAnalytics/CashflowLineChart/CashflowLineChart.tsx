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
  const data = useMemo(() => {
    // Example structure of data
    return [
      { date: '2023-01-01', inflow: 1000, outflow: 500, total: 400 },
      { date: '2023-02-01', inflow: 1500, outflow: 700, total: 300 },
      { date: '2023-02-05', inflow: 1500, outflow: 700, total: 1000 },
      { date: '2023-02-06', inflow: 1500, outflow: 700, total: 900 },
      { date: '2023-02-02', inflow: 1500, outflow: 700, total: 750 },
      // Add more data points as needed
    ];
  }, []);
  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <LineChart width={500} height={200} data={data}>
        {/* <CartesianGrid strokeDasharray="5 5" /> */}
        <XAxis dataKey={'date'} />
        <YAxis />
        {/* <Legend /> */}
        <Tooltip />
        <Line dataKey="inflow" name="Inflow" stroke="#82ca9d"  type={'bump'}></Line>
        <Line dataKey="outflow" name="Outflow" stroke="#ff6961" type={'bump'}></Line>
        <Line dataKey={'total'} name="Total" type={'bump'} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CashflowLineChart;
