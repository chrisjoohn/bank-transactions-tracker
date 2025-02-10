import { FC } from 'react';
import { format, parse } from 'date-fns';

import { Table, Flex, Button } from 'antd';

// type definitions
import type {
  ParsedTrx,
  DebitTransaction,
} from '../../../../../../../integration/apis/debit_transactions';

export type VerifyDataProps = {
  parsedData: ParsedTrx[];
  onSubmitCallback?: () => void;
};

type TableData = Omit<
  DebitTransaction,
  'id' | 'unique_code' | 'amount' | 'account_id' | 'transaction_type'
> & {
  amount: string;
  transaction_type: 'INFLOW' | 'OUTFLOW' | 'INVALID';
};

const VerifyData: FC<VerifyDataProps> = (props) => {
  const { parsedData, onSubmitCallback } = props;

  /**
   * DOCS:
   * param:
   *  dateString: string i.e. Oct 25
   *
   * this function will return parsed dates with complete year
   *  - setting year of months greater than current month to the previous year;
   *  - and sets months equal or less than current month to current year;
   *
   * TODO:
   * This is just a temp implem until date is parsed from statement
   */
  const _finalizeDate = (dateString: string): Date => {
    const parsedDate = parse(dateString, 'MMM dd', new Date());
    const parsedMonth = parsedDate.getMonth() + 1;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const yearToUse =
      parsedMonth >= currentMonth ? currentYear - 1 : currentYear;

    return new Date(yearToUse, parsedDate.getMonth(), parsedDate.getDate());
  };

  const _tableData: TableData[] = parsedData.map((item) => {
    const description = `${item.description} ${item.details || ''}`;
    let transaction_type: TableData['transaction_type'] = 'INVALID';
    let amount = '0';

    if (item.credit_amount) {
      transaction_type = 'INFLOW';
      amount = item.credit_amount;
    }

    if (item.debit_amount) {
      transaction_type = 'OUTFLOW';
      amount = item.debit_amount;
    }

    return {
      transaction_date: format(_finalizeDate(item.date), 'MMM dd, yyyy'),
      description,
      transaction_type,
      amount,
    };
  });

  return (
    <div>
      <Table<TableData>
        scroll={{
          y: 500,
        }}
        sticky
        pagination={false}
        size='large'
        style={{ width: '100%' }}
        dataSource={_tableData}
        columns={[
          {
            title: 'Transaction Date',
            dataIndex: 'transaction_date',
          },
          {
            title: 'Description',
            dataIndex: 'description',
          },
          {
            title: 'Transaction type',
            dataIndex: 'transaction_type',
          },
          {
            title: 'Amount',
            dataIndex: 'amount',
          },
        ]}
      />
      {onSubmitCallback && (
        <Flex justify='flex-end'>
          <Button
            type='primary'
            onClick={onSubmitCallback}
            style={{ marginTop: 20 }}
          >
            Submit
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default VerifyData;
