/**
 * TODO: Move this into pages/Transactions
 * - should be the main component for the transactions page
 * - should handle the layout and structure of the page
 * - should include the date filter, analytics, and transaction list
 * - should manage the state for the date filter and pass it down to child components
 * - should handle the modal for adding transactions
 * - should use the useTransactions hook for data fetching and state management
 */
import { FC } from 'react';

import { Card, Button, Modal, Tag } from 'antd';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// major components
import Analytics from '../TransactionsAnalytics';
import TransactionList from '../TransactionList';

// reusable components
import { DateFilter } from './components';

// hooks
import useTransactions from './useTransactions.hooks';

// types
import type { Account } from '../../integration/apis/accounts';
import TransactionStepperForm from '../TransactionStepperForm';

// styles
import './transactions.styles.scss';

export interface TransactionsProps {
  withAnalytics?: boolean;
  account: Account;
}

const Transactions: FC<TransactionsProps> = (props) => {
  const { account } = props;

  const {
    dateFilter,
    setDateFilter,

    listData,

    showModal,
    setShowModal,

    activeTagFilters,

    // tagFilter,
    addTagFilter,
    removeTagFilter,

    perTagAnalytics: data,
  } = useTransactions(props);

  return (
    <div className="btt-transactions">
      <div className="date-filter">
        <DateFilter
          onChange={(date) => {
            setDateFilter({ start_date: date.startDate, end_date: date.endDate });
          }}
        />
      </div>
      <div className="analytics">
        {dateFilter && (
          <Analytics dateFilter={dateFilter} account={account} tagsFilter={activeTagFilters} />
        )}
      </div>
      {/**
       * TODO: Refactor this charts thing
       */}
      <Card className="charts">
        {activeTagFilters.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p>Active tag filters: </p>
            {activeTagFilters.map((item) => {
              return (
                <Tag closable onClose={() => removeTagFilter(item?.id || 0)}>
                  {item?.name}
                </Tag>
              );
            })}
          </div>
        )}
        <ResponsiveContainer width={'100%'} height={500}>
          <BarChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={'name'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={'total_amount'} name={'Total Amount'} fill="#8cc8e9">
              {(data || []).map((item) => {
                return (
                  <Cell
                    style={{ cursor: 'pointer' }}
                    key={item.id}
                    onClick={() => addTagFilter(item.id)}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="transactions-list">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <Button onClick={() => setShowModal(true)}>Add transactions</Button>
          </div>
          <TransactionList account={account} listData={listData} />
        </Card>
      </div>

      <Modal
        open={showModal}
        width={1500}
        centered
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <TransactionStepperForm account={account} key={new Date().toString()} />
      </Modal>
    </div>
  );
};

export default Transactions;
