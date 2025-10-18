import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import TagSelector from '../TagSelector';

// apis
import { tagsApi, accountsApi } from '../../integration/apis';

// redux slice
import { transactionSelectors } from '../../integration/slices/transactions.slice';

// type definitions
import type { SelectProps } from 'antd';

import { CreditTransaction } from '../../integration/apis/creditTransactions';
import { RootState } from '../../integration/store';

export type TransactionTagSelectorProps = {
  transactionId: string;
  accountId: string;
};

const TransactionTagSelector: FC<TransactionTagSelectorProps> = (props) => {
  const { transactionId, accountId } = props;

  const transaction = useSelector((state: RootState) =>
    transactionSelectors.selectById(state, transactionId)
  );

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

  const _transaction = transaction as CreditTransaction; // TODO: check way to remove this cast

  const transactionTags = _transaction?.tags
    ? _transaction.tags.map((item) => item.unique_code)
    : [];

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

  return (
    <TagSelector
      mode="multiple"
      value={transactionTags}
      onSelect={_onSelectHandler}
      onDeselect={_onDeselectHandler}
    />
  );
};

export default TransactionTagSelector;
