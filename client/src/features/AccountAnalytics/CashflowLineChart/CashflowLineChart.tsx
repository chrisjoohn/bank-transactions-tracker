import { FC, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// api
import { accountsApi } from '../../../integration/apis';

export interface CashflowLineChartProps {
  accountId: string;
  dateFilter: {
    filterType: string;
    startDate: string;
    endDate: string;
  };
}

const CashflowLineChart: FC<CashflowLineChartProps> = (props) => {
  const { accountId, dateFilter } = props;

  const groupBy = useMemo(() => {
    switch (dateFilter.filterType) {
      case 'custom':
      case 'month':
        return 'week';
      case 'quarter':
      case 'year':
        return 'month';
    }
  }, [dateFilter.filterType]);

  const { data: cashflowData } = accountsApi.useCashflowQuery({
    id: accountId,
    requestBody: {
      filters: {
        transaction_date: {
          start_date: dateFilter.startDate,
          end_date: dateFilter.endDate,
        },
      },
      group_by: groupBy,
      fields: ['inflow', 'outflow', 'total'],
    },
  });

  // Process accountTransactions to get inflow and outflow data
  // This is a placeholder; replace with actual logic to compute inflow and outflow

  /**
   * Sample payload to generate this data
   *  POST /api/transactions/cashflow
   *  {
   *   "account_id": "account_unique_code",
   *   "filters": {
   *     "post_date": {
   *        "start_date": "2023-01-01",
   *        "end_date": "2023-12-31"
   *     }
   *   },
   *   "group_by": "day|week|month|year", // optional, default to month
   *   "fields": ["inflow", "outflow", "total"] // optional, default to all
   *  }
   */

  const sampleResponse = {
    shape: {
      xKeys: [{ key: 'period', name: 'Period' }],
      yKeys: [
        { key: 'inflow', name: 'Inflow' },
        { key: 'outflow', name: 'Outflow' },
        { key: 'total', name: 'Total' },
      ],
    },
    data: cashflowData,
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
