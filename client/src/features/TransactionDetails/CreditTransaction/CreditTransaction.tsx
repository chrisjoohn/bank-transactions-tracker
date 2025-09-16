import { FC } from 'react';

import { format } from 'date-fns';

// components
import TransactionTagSelector from '../../TransactionTagSelector';

// types
import type { CreditTransaction } from '../../../integration/apis/creditTransactions';

export interface CreditTransactionProps {
  accountId: string;
  transaction: CreditTransaction;
}

const CreditTransaction: FC<CreditTransactionProps> = (props) => {
  const { transaction, accountId } = props;
  return (
    <div>
      <h2>Transaction details</h2>
      <div>
        <h4>Description</h4>
        <p>{transaction.description}</p>
      </div>
      <div>
        <h4>Amount</h4>
        <p>{transaction.amount}</p>
      </div>
      <div>
        <h4>Transaction date</h4>
        <p>{format(transaction.transaction_date, 'MMM dd, yyyy')}</p>
      </div>
      <div>
        <h4>Post date</h4>
        <p>{format(transaction.post_date, 'MMM dd, yyyy')}</p>
      </div>
      <div>
        <h4>Tags</h4>
        <TransactionTagSelector accountId={accountId} transactionId={transaction.unique_code} />
      </div>
    </div>
  );
};

export default CreditTransaction;
