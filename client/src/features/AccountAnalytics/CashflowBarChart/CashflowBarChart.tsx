import { FC, useMemo } from 'react';

import { Empty } from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  YAxis,
  XAxis,
  CartesianGrid,
  Tooltip,
  Line,
} from 'recharts';

import { accountsApi } from '../../../integration/apis';

export interface CashBarChartType {
  accountId: string;
  dateFilter: {
    filterType: string;
    startDate: string;
    endDate: string;
  };
}

const CashflowBarChart: FC<CashBarChartType> = (props) => {
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
      account_id: accountId,
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

  // TODO: API response should be on this shape
  const sampleResponse = {
    shape: {
      xKeys: [{ key: 'period', name: 'Period' }],
      yKeys: [
        { key: 'inflow', name: 'Inflow' },
        { key: 'outflow', name: 'Outflow' },
        // { key: 'total', name: 'Total' },
      ],
    },
    data: cashflowData,
  };

  const colorMap: Record<'inflow' | 'outflow' | 'total', string> = {
    inflow: '#82ca9d',
    outflow: '#ff6961',
    total: '#8884d8',
  };

  const { shape, data } = sampleResponse;

  if (data === undefined || data.length === 0) {
    return <Empty />
  }

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <BarChart width={500} height={200} data={data}>
        <CartesianGrid strokeDasharray="5 5" />
        {shape.xKeys.map((xKey) => {
          return <XAxis key={xKey.key} dataKey={xKey.key} />;
        })}
        <YAxis />
        <Tooltip />
        {shape.yKeys.map((yKey) => {
          return (
            <Bar
              key={yKey.key}
              dataKey={yKey.key}
              name={yKey.name}
              fill={colorMap[yKey.key as 'inflow' | 'outflow' | 'total'] || '#000000'}
            />
          );
        })}
        <Line dataKey={'total'} type={'bump'} name="Total" stroke={colorMap['total']} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CashflowBarChart;
