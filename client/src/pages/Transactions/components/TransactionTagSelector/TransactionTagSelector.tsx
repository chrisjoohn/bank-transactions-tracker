import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Select } from 'antd';

import type { SelectProps } from 'antd';

// apis
import { tagsApi, accountsApi } from '../../../../integration/apis';

// redux slice
import { transactionSelectors } from '../../../../integration/slices/transactions.slice';

// type definitions
import { CreditTransaction } from '../../../../integration/apis/creditTransactions';
import { RootState } from '../../../../integration/store';

export type TransactionTagSelectorProps = {
  transactionId: string;
  accountId: string;
};

const TransactionTagSelector: FC<TransactionTagSelectorProps> = (props) => {
  const { transactionId, accountId } = props;

  const transaction = useSelector((state: RootState) =>
    transactionSelectors.selectById(state, transactionId)
  );

  const { data: tags } = tagsApi.useGetTagsQuery();
  const [createTransactionTag] = tagsApi.useCreateTransactionTagMutation();
  const [deleteTransactionTag] = tagsApi.useDeleteTransactionTagsMutation();
  const [getTransaction] = accountsApi.useLazyGetTransactionQuery();

  useEffect(() => {
    if (!transaction) {
      getTransaction({
        id: accountId,
        transactionId,
      });
    }
  }, [transaction, accountId, transactionId]);

  const _transaction = transaction as CreditTransaction;

  const transactionTags = _transaction?.tags
    ? _transaction.tags.map((item) => item.unique_code)
    : [];

  const options: SelectProps['options'] = tags?.map((item) => {
    return {
      label: item.name,
      value: item.unique_code,
    };
  });

  // const _onChangeHandler: SelectProps['onChange'] = (value, option) => {};

  const _onSelectHandler: SelectProps['onSelect'] = (value) => {
    createTransactionTag({
      account_id: accountId,
      body: { transaction_id: transactionId, tag_id: value },
    });
  };

  const _onDeselectHandler: SelectProps['onDeselect'] = (value) => {
    deleteTransactionTag({
      accountId,
      transactionId,
      tagId: value,
    });
  };

  const _selectFilter: SelectProps['filterOption'] = (input, option) => {
    return (option?.label || '').toString().toLowerCase().includes(input.toLowerCase());
  };

  return (
    <Select
      mode="multiple"
      style={{
        width: '100%',
      }}
      options={options}
      defaultValue={transactionTags}
      // value={transactionTags} // TODO: needs to invalidate transaction data so it's always refreshed
      // onChange={_onChangeHandler}
      onSelect={_onSelectHandler}
      onDeselect={_onDeselectHandler}
      filterOption={_selectFilter}
    />
  );
};

export default TransactionTagSelector;
