import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Table } from 'antd';

import { ColumnsType } from 'antd/es/table';

// types
import type { ParsedCreditTrx } from '../../../../../../../../integration/types';
import type { EditableCreditTransaction } from '../../../../../../../../integration/apis/creditTransactions';

export type CreditTransactionsProps = {
  parsedData: ParsedCreditTrx[];
  finalizeDate: (dateString: string, dateFormat: string) => Date;
  commonTblProps?: object;
};

const CreditTransactions: FC<CreditTransactionsProps> = (props) => {
  const { parsedData, finalizeDate, commonTblProps } = props;

  const [creditTransactions, _setCreditTransactions] = useState<
    EditableCreditTransaction[] | null
  >(null);

  useEffect(() => {
    // transform data just once
    if (creditTransactions) {
      return;
    }

    const _creditTrx: EditableCreditTransaction[] = parsedData.map((item) => {
      return {
        description: item.description,
        transaction_date: format(
          finalizeDate(item.transaction_date, 'MMMM dd'),
          'MMM dd, yyyy'
        ),
        post_date: format(
          finalizeDate(item.post_date, 'MMMM dd'),
          'MMM dd, yyyy'
        ),
        amount: parseFloat(item.amount.replace(',', '')),
      };
    });

    _setCreditTransactions(_creditTrx);
  }, []);

  const creditTrxColumns: ColumnsType<EditableCreditTransaction> = [
    {
      title: 'Transaction Date',
      dataIndex: 'transaction_date',
    },

    {
      title: 'Post Date',
      dataIndex: 'post_date',
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
        dataSource={creditTransactions || []}
        columns={creditTrxColumns}
      />
    </>
  );
};

export default CreditTransactions;
