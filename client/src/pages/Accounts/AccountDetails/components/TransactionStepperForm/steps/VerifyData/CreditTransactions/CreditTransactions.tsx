import { FC, useEffect, useContext } from 'react';
import { format } from 'date-fns';

// components
import { Table } from 'antd';

// context
import { TransactionStepperFormContext } from '../../../TransactionStepperFormContext';

// type definitions
import type { ColumnsType } from 'antd/es/table';

import type { ParsedCreditTrx } from '../../../../../../../../integration/types';
import type { EditableCreditTransaction } from '../../../../../../../../integration/apis/creditTransactions';

export type CreditTransactionsProps = {
  finalizeDate: (dateString: string, dateFormat: string) => Date;
  commonTblProps?: object;
};

const CreditTransactions: FC<CreditTransactionsProps> = (props) => {
  const { finalizeDate, commonTblProps } = props;

  const { parsedTransactions, normalizedTransactions } = useContext(TransactionStepperFormContext);

  const { data: parsedData } = parsedTransactions || {};
  const { data: creditTransactions } = normalizedTransactions || {};

  useEffect(() => {
    // transform data just once
    if ((creditTransactions || []).length > 0) {
      return;
    }

    const _creditTrx: EditableCreditTransaction[] = (parsedData as ParsedCreditTrx[]).map(
      (item) => {
        return {
          description: item.description,
          transaction_date: format(finalizeDate(item.transaction_date, 'MMMM dd'), 'yyyy-MM-dd'),
          post_date: format(finalizeDate(item.post_date, 'MMMM dd'), 'yyyy-MM-dd'),
          amount: parseFloat(item.amount.replace(',', '')),
        };
      }
    );

    normalizedTransactions?.setData(_creditTrx);
  }, []);

  const creditTrxColumns: ColumnsType<EditableCreditTransaction> = [
    {
      title: 'Transaction Date',
      dataIndex: 'transaction_date',
      render: (value) => format(value, 'MMM dd, yyyy'),
    },

    {
      title: 'Post Date',
      dataIndex: 'post_date',
      render: (value) => format(value, 'MMM dd, yyyy'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => value.toFixed(2),
    },
  ];

  // TODO: check if we could use TransactionList here
  return (
    <>
      <Table<EditableCreditTransaction>
        {...commonTblProps}
        pagination={false}
        dataSource={(creditTransactions as EditableCreditTransaction[]) || []}
        columns={creditTrxColumns}
      />
    </>
  );
};

export default CreditTransactions;
