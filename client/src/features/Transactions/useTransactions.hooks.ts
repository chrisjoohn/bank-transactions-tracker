import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';

import { accountsApi } from '../../integration/apis';

import { transactionSelectors } from '../../integration/slices/transactions.slice';
import { tagSelectors } from '../../integration/slices/tags.slice';

import type { TransactionsProps } from './Transactions';
import type { RootState } from '../../integration/store';
import type { Tag } from '../../integration/apis/tags';

const useTransactions = (props: TransactionsProps) => {
  const { account } = props;

  const [dateFilter, setDateFilter] = useState<
    undefined | { start_date: string; end_date: string }
  >(undefined);
  const [tagFilter, setTagFilter] = useState<number[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);

  const accountTransactions = accountsApi.useGetTransactionsQuery(
    {
      id: account.unique_code,
      requestBody: {
        filters: {
          date_range: dateFilter,
          tags: tagFilter,
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

  // TODO: rename this
  const perTagAnalytics = accountsApi.useGetTotalPerTagQuery(
    {
      id: account.unique_code,
      requestBody: {
        filters: {
          post_date: dateFilter,
          tags: tagFilter,
        },
      },
    },
    {
      skip: !account.id || !dateFilter,
    }
  );

  /** Transactions */
  const transactions = useSelector((state: RootState) => transactionSelectors.selectAll(state));

  const listData = useMemo(() => {
    const ids = (accountTransactions.data || []).map((item) => item.unique_code);
    return transactions.filter((item) => {
      return ids.includes(item.unique_code);
    });
  }, [transactions, accountTransactions]);

  /** Tags */
  const tags = useSelector((state: RootState) => tagSelectors.selectAll(state));
  const activeTagFilters: Tag[] = useMemo(() => {
    return tagFilter
      .map((item) => {
        return tags.find((tag) => item === tag.id);
      })
      .filter((item) => !!item);
  }, [tags, tagFilter]);

  const addTagFilter = (tagId: number) => {
    const _tagFilter = _.cloneDeep(tagFilter);
    _tagFilter.push(tagId);

    setTagFilter(_tagFilter);
  };

  const removeTagFilter = (tagId: number) => {
    const _tagFilter = _.cloneDeep(tagFilter);
    const idx = _tagFilter.findIndex((item) => item === tagId);
    if (idx > -1) {
      _tagFilter.splice(idx, 1);
      setTagFilter(_tagFilter);
    }
  };

  return {
    listData,

    dateFilter,
    setDateFilter,

    showModal,
    setShowModal,

    activeTagFilters,
    addTagFilter,
    removeTagFilter,

    perTagAnalytics: perTagAnalytics.data,
  };
};

export default useTransactions;
