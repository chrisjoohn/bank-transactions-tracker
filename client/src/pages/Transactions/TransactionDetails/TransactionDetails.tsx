import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import { accountsApi } from '../../../integration/apis';
import type { CreditTransaction } from '../../../integration/apis/creditTransactions';
import { transactionSelectors } from '../../../integration/slices/transactions.slice';
import { RootState } from '../../../integration/store';

import { TransactionTagSelector } from '../components';

// export type TransactionDetailsProps = { transactionId: string; accountId: Account['unique_code'] };

const TransactionDetails: FC = () => {
  const { accountId, transactionId } = useParams<{ accountId: string; transactionId: string }>();
  const navigate = useNavigate();

  if (!accountId || !transactionId) {
    navigate(-1);
    return;
  }

  const data = useSelector((state: RootState) =>
    transactionSelectors.selectById(state, transactionId)
  );

  const [getTransaction] = accountsApi.useLazyGetTransactionQuery();

  useEffect(() => {
    if (!data) {
      getTransaction({
        id: accountId,
        transactionId,
      });
    }
  }, [data]);

  if (!data) {
    return null;
  }

  return (
    <div>
      <h2>Transaction details</h2>
      <div>
        <h4>Description</h4>
        <p>{data?.description}</p>
      </div>
      <div>
        <h4>Amount</h4>
        <p>{data?.amount}</p>
      </div>
      <div>
        <h4>Transaction date</h4>
        <p>{format((data as CreditTransaction)?.transaction_date, 'MMM dd, yyyy')}</p>
      </div>
      <div>
        <h4>Post date</h4>
        <p>{format((data as CreditTransaction)?.post_date, 'MMM dd, yyyy')}</p>
      </div>
      <TransactionTagSelector accountId={accountId} transactionId={transactionId} />
    </div>
  );
};

export default TransactionDetails;
