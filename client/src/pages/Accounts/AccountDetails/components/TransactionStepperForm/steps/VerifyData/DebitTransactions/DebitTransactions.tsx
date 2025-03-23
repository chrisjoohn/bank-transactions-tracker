import { FC, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Table } from 'antd';

import type { ColumnsType } from 'antd/es/table';

// type definitions
import type { ParsedDebitTrx } from '../../../../../../../../integration/types';
import type { EditableDebitTransaction } from '../../../../../../../../integration/apis/debitTransactions';

export type DebitTransactionsProps = {
  parsedData: ParsedDebitTrx[];
  finalizeDate: (dateString: string) => Date;
  commonTblProps?: object;
};

const DebitTransactions: FC<DebitTransactionsProps> = (props) => {
  const { parsedData, finalizeDate, commonTblProps } = props;

  const [debitTransactions, _setDebitTransactions] = useState<
    EditableDebitTransaction[] | null
  >(null);

  useEffect(() => {
    if (debitTransactions) {
      return;
    }

    // transform data here
    const _debitTrx: EditableDebitTransaction[] = parsedData.map((item) => {
      return {
        transaction_date: format(finalizeDate(item.date), 'MMM dd, yyyy'),
        description: `${item.description} ${item.details}`.trim(),
        transaction_type: item.debit_amount ? 'OUTFLOW' : 'INFLOW',
        amount: parseFloat(
          (item.credit_amount || item.debit_amount || '0').replace(',', '')
        ),
      };
    });

    _setDebitTransactions(_debitTrx);
  }, []);

  const debitTrxColumns: ColumnsType<EditableDebitTransaction> = [
    {
      title: 'Transaction Date',
      dataIndex: 'transaction_date',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Transaction Type',
      dataIndex: 'transaction_type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => value.toFixed(2),
    },
  ];

  // TODO: Check if we can utilize TransactionList component here
  return (
    <Table<EditableDebitTransaction>
      {...commonTblProps}
      pagination={false}
      dataSource={debitTransactions || []}
      columns={debitTrxColumns}
    />
  );
};

export default DebitTransactions;
