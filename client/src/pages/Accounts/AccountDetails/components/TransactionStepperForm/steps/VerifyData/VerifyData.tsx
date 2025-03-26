import { FC, useContext, useEffect } from 'react';
import { parse } from 'date-fns';

// context
import { TransactionStepperFormContext } from '../../TransactionStepperFormContext';

import { Flex, Button } from 'antd';

// components
import DebitTransactions from './DebitTransactions';
import CreditTransactions from './CreditTransactions';

// type definitions
import { accountsApi, type Account } from '../../../../../../../integration/apis/accounts';

export type VerifyDataProps = {
  account: Account;
};

const VerifyData: FC<VerifyDataProps> = (props) => {
  const { account } = props;
  const { type: accountType } = account;

  const { formControls, normalizedTransactions } = useContext(TransactionStepperFormContext);

  const [bulkCreateTransactions, bulkCreateState] = accountsApi.useBulkCreateTransactionsMutation();

  const _bulkCreateTransactions = async () => {
    if (normalizedTransactions?.data === undefined) {
      return;
    }

    bulkCreateTransactions({
      records: normalizedTransactions?.data,
      id: account.unique_code,
    });

    // TODO: implement error handling here
  };

  useEffect(() => {
    if (bulkCreateState.isSuccess) {
      formControls?.nextStep();
    }
  }, [bulkCreateState.isSuccess]);

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
  const finalizeDate = (dateString: string, dateFormat: string = 'MMM dd'): Date => {
    const parsedDate = parse(dateString, dateFormat, new Date());
    const parsedMonth = parsedDate.getMonth() + 1;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const yearToUse = parsedMonth >= currentMonth ? currentYear - 1 : currentYear;

    return new Date(yearToUse, parsedDate.getMonth(), parsedDate.getDate());
  };

  const _tableRender = () => {
    const commonTblProps = {
      scroll: {
        y: 500,
      },
      sticky: true,
      style: { width: '100%' },
    };

    if (accountType === 'CREDIT') {
      return <CreditTransactions finalizeDate={finalizeDate} commonTblProps={commonTblProps} />;
    }

    if (accountType === 'DEPOSIT') {
      return <DebitTransactions finalizeDate={finalizeDate} commonTblProps={commonTblProps} />;
    }
  };

  return (
    <>
      {_tableRender()}
      <Flex justify="flex-end">
        <Button type="primary" onClick={_bulkCreateTransactions} style={{ marginTop: 20 }}>
          Submit
        </Button>
      </Flex>
    </>
  );
};

export default VerifyData;
