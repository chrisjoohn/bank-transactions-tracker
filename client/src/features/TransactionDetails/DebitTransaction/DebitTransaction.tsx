import { FC } from 'react';
import { format } from 'date-fns';

// components
import { TransactionTagSelector } from '../../../pages/Transactions/components';

// types
import type { DebitTransaction } from '../../../integration/apis/debitTransactions';

export interface DebitTransactionProps {
  // Define props here in the future
  transaction: DebitTransaction;
  accountId: string;
}

const DebitTransaction: FC<DebitTransactionProps> = (props) => {
  const { transaction, accountId } = props;

  return (
    <div className="btt-debit-transaction-details">
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
        <h4>Transaction Type</h4>
        <p>{transaction.transaction_type}</p>
      </div>
      <div>
        <h4>Tags</h4>
        <TransactionTagSelector accountId={accountId} transactionId={transaction.unique_code} />
      </div>
    </div>
  );
};

export default DebitTransaction;
