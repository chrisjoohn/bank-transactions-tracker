import { FC } from 'react';
import { useSelector } from 'react-redux';

// components
import DebitTransaction from './DebitTransaction';
import CreditTransaction from './CreditTransaction';

// redux
import { transactionSelectors } from '../../integration/slices/transactions.slice';
import { accountSelectors } from '../../integration/slices/accounts.slice';

// types
import type { Account } from '../../integration/apis/accounts';
import type { RootState } from '../../integration/store';

export interface TransactionDetailsProps {
  // Define props here in the future
  accountId: Account['unique_code'];
  transactionId: string;
}

const TransactionDetails: FC<TransactionDetailsProps> = (props) => {
  const { transactionId, accountId } = props;

  const transaction = useSelector((state: RootState) =>
    transactionSelectors.selectById(state, transactionId)
  );

  const account = useSelector((state: RootState) => accountSelectors.selectById(state, accountId));

  if (account.type === 'DEPOSIT') {
    return <DebitTransaction transaction={transaction as DebitTransaction} />;
  }

  if (account.type === 'CREDIT') {
    return (
      <CreditTransaction
        transaction={transaction as CreditTransaction}
        accountId={account.unique_code}
      />
    );
  }

  return <div>Transaction Details</div>;
};

export default TransactionDetails;
