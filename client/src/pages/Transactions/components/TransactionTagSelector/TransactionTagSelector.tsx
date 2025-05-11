import { FC } from 'react';

import { Select } from 'antd';

import type { SelectProps } from 'antd';

import { tagsApi, accountsApi } from '../../../../integration/apis';
import { CreditTransaction } from '../../../../integration/apis/creditTransactions';

export type TransactionTagSelectorProps = {
  transactionId: string;
  accountId: string;
};

const TransactionTagSelector: FC<TransactionTagSelectorProps> = (props) => {
  const { transactionId, accountId } = props;

  const { data: transaction } = accountsApi.useGetTransactionQuery({
    id: accountId,
    transactionId,
  });
  const { data: tags } = tagsApi.useGetTagsQuery();
  const [createTransactionTag] = tagsApi.useCreateTransactionTagMutation();
  const [deleteTransactionTag] = tagsApi.useDeleteTransactionTagsMutation();

  const _transaction = transaction as CreditTransaction;

  const transactionTags = _transaction?.tags
    ? _transaction.tags.map((item) => item.tag?.unique_code)
    : [];

  const options: SelectProps['options'] = tags?.map((item) => {
    return {
      label: item.name,
      value: item.unique_code,
    };
  });

  const _onChangeHandler: SelectProps['onChange'] = (value, option) => {};

  const _onSelectHandler: SelectProps['onSelect'] = (value) => {
    createTransactionTag({
      account_id: accountId,
      body: { transaction_id: transactionId, tag_id: value },
    });
  };

  const _onDeselectHandler: SelectProps['onDeselect'] = (value) => {
    const transactionTag = (_transaction.tags || []).find((item) => {
      return item.tag?.unique_code === value;
    });

    if (!transactionTag) {
      return;
    }

    deleteTransactionTag({
      accountId,
      transactionTagId: transactionTag?.unique_code,
    });
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
      onChange={_onChangeHandler}
      onSelect={_onSelectHandler}
      onDeselect={_onDeselectHandler}
    />
  );
};

export default TransactionTagSelector;
