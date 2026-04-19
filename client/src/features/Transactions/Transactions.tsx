/**
 * TODO: Move this into pages/Transactions
 * - should be the main component for the transactions page
 * - should handle the layout and structure of the page
 * - should include the date filter, analytics, and transaction list
 * - should manage the state for the date filter and pass it down to child components
 * - should handle the modal for adding transactions
 * - should use the useTransactions hook for data fetching and state management
 */
import { FC, useState } from 'react';

import { Card, Button, Modal } from 'antd';

// major components
import Analytics from '../TransactionsAnalytics';
import TransactionList from '../TransactionList';
import AccountAnalytics from '../AccountAnalytics';

import TagCharts from '../TagCharts';

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

  const [dateFilterType, setDateFilterType] = useState('month');

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

  const renderAnalytics = () => {
    if (!dateFilter) return null;

    if (account.type === 'CREDIT') {
      return (
        <>
          {/* <Card style={{ width: '50%' }}>
            <h2>Outflow Trend</h2>
            {dateFilter && (
              <AccountAnalytics.CashflowLineChart
                accountId={account.unique_code}
                dateFilter={{
                  startDate: dateFilter?.start_date,
                  endDate: dateFilter?.end_date,
                  filterType: dateFilterType,
                }}
              />
            )}
          </Card> */}
          <TagCharts.TagChartsRenderer accountId={account.unique_code} />
        </>
      );
    }

    return (
      <>
        <Card style={{ width: '50%' }}>
          <h2>Cashflow Chart</h2>
          {dateFilter && (
            <AccountAnalytics.CashflowBarChart
              accountId={account.unique_code}
              dateFilter={{
                startDate: dateFilter?.start_date,
                endDate: dateFilter?.end_date,
                filterType: dateFilterType,
              }}
            />
          )}
        </Card>
        <Card style={{ width: '50%' }}>
          <h2>Cashflow Trend</h2>
          {dateFilter && (
            <AccountAnalytics.CashflowLineChart
              accountId={account.unique_code}
              dateFilter={{
                startDate: dateFilter?.start_date,
                endDate: dateFilter?.end_date,
                filterType: dateFilterType,
              }}
            />
          )}
        </Card>
      </>
    );
  };

  return (
    <div className="btt-transactions">
      <div className="date-filter">
        <DateFilter
          onChange={(date) => {
            setDateFilter({ start_date: date.startDate, end_date: date.endDate });
            setDateFilterType(date.filterType);
          }}
        />
      </div>
      <div className="analytics">
        {dateFilter && (
          <Analytics dateFilter={dateFilter} account={account} tagsFilter={activeTagFilters} />
        )}
      </div>
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>{renderAnalytics()}</div>
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
