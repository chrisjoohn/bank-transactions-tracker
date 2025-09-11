import { FC } from 'react';

import type { DebitTransaction } from '../../../integration/apis/debitTransactions';

export interface DebitTransactionProps {
  // Define props here in the future
  transaction: DebitTransaction;
}

const DebitTransaction: FC<DebitTransactionProps> = (props) => {
  const { transaction } = props;

  return (
    <div className='btt-debit-transaction-details'>
      <p>id: {transaction.unique_code}</p>
	  <p>description: {transaction.description}</p>
      <p>amount: {transaction.amount}</p>
	  <p>date: {transaction.transaction_date}</p>
      <p>type: {transaction.transaction_type}</p>
    </div>
  );
};

export default DebitTransaction;
