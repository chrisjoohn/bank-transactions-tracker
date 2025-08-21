import { FC, useEffect, useContext } from 'react';
import { format } from 'date-fns';

// componentes
import { Table } from 'antd';

// context
import { TransactionStepperFormContext } from '../../../TransactionStepperFormContext';

// type definitions
import type { ColumnsType } from 'antd/es/table';

import type { ParsedDebitTrx } from '../../../../../integration/types';
import type { EditableDebitTransaction } from '../../../../../integration/apis/debitTransactions';

export type DebitTransactionsProps = {
  finalizeDate: (dateString: string) => Date;
  commonTblProps?: object;
};

const DebitTransactions: FC<DebitTransactionsProps> = (props) => {
  const { finalizeDate, commonTblProps } = props;

  const { parsedTransactions, normalizedTransactions } = useContext(TransactionStepperFormContext);

  const { data: parsedData } = parsedTransactions || {};
  const { data: debitTransactions } = normalizedTransactions || {};

  useEffect(() => {
    if ((debitTransactions || []).length > 0) {
      return;
    }

    // transform data here
    const _debitTrx: EditableDebitTransaction[] = (parsedData as ParsedDebitTrx[]).map((item) => {
      return {
        transaction_date: format(finalizeDate(item.date), 'yyyy-MM-dd'),
        description: `${item.description} ${item.details}`.trim(),
        transaction_type: item.debit_amount ? 'OUTFLOW' : 'INFLOW',
        amount: parseFloat((item.credit_amount || item.debit_amount || '0').replace(',', '')),
        running_balance: item.running_balance,
      };
    });

    normalizedTransactions?.setData(_debitTrx);
  }, []);

  const debitTrxColumns: ColumnsType<EditableDebitTransaction> = [
    {
      title: 'Transaction Date',
      dataIndex: 'transaction_date',
      render: (value) => format(value, 'MMM dd, yyyy'),
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
      dataSource={(debitTransactions as EditableDebitTransaction[]) || []}
      columns={debitTrxColumns}
    />
  );
};

export default DebitTransactions;
