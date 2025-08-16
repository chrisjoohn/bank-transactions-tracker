import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { accountsApi } from '../../integration/apis';

import { transactionSelectors } from '../../integration/slices/transactions.slice';

import { TransactionsProps } from './Transactions';
import { RootState } from '../../integration/store';

const useTransactions = (props: TransactionsProps) => {
  const { account } = props;

  const [dateFilter, setDateFilter] = useState<null | { start_date: string; end_date: string }>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);

  const accountTransactions = accountsApi.useGetTransactionsQuery(
    {
      id: account.unique_code,
      requestBody: {
        filters: {
          date_range: dateFilter,
        },
        includes: {
          tags: {},
        },
      },
    },
    {
      skip: !account.id || !dateFilter,
    }
  );

  const transactions = useSelector((state: RootState) => transactionSelectors.selectAll(state));

  const listData = useMemo(() => {
    const ids = (accountTransactions.data || []).map((item) => item.unique_code);
    return transactions.filter((item) => {
      return ids.includes(item.unique_code);
    });
  }, [transactions, accountTransactions]);

  return {
    listData,

    dateFilter,
    setDateFilter,

    showModal,
    setShowModal,
  };
};

export default useTransactions;
