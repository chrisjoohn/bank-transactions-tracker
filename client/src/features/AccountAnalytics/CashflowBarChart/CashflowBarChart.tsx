import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

import { accountSelectors } from '../../../integration/slices/accounts.slice';
import { transactionSelectors } from '../../../integration/slices/transactions.slice';
import { RootState } from '../../../integration/store';

export interface CashBarChartType {
  accountId: string;
  dateFilter: {
    filterType: string;
    startDate: string;
    endDate: string;
  };
  listData?: any[];
}

const CashflowBarChart: FC<CashBarChartType> = (props) => {
  const { accountId } = props;

  const account = useSelector((state: RootState) => accountSelectors.selectById(state, accountId));
  const transactions = useSelector((state: RootState) => transactionSelectors.selectAll(state));

  const accountTransactions = useMemo(() => {
    if (!account) return [];
    return transactions.filter((item) => item.account_id === account.id);
  }, [transactions, account]);

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
  }, [accountTransactions]);

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart width={500} height={200} data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis dataKey={'date'} />
        <YAxis />
        {/* <Legend /> */}
        <Bar dataKey="inflow" name="Inflow" fill="#82ca9d" barSize={30}></Bar>
        <Bar dataKey="outflow" name="Outflow" fill="#ff6961" barSize={30}></Bar>
        {/* <Line dataKey={'total'} name="Total" type={'monotone'} /> */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashflowBarChart;
