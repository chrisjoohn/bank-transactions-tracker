import { FC } from 'react';

// components
import { Flex, Empty } from 'antd';

// type definitions
import type { TransactionsProps } from '../Transactions';
export type TransactionListProps = {
  account: TransactionsProps['account'];
  filters?: {
    date: string;
  };
};

const TransactionList: FC<TransactionListProps> = (props) => {
  const {} = props;
  return (
    <Flex
      style={{ width: '100%' }}
      justify='center'
      align='center'
    >
      <Empty />
    </Flex>
  );
};

export default TransactionList;
