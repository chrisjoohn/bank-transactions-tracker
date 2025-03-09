import { FC, useState } from 'react';

import { Flex, Result, Row, Steps } from 'antd';
import { UploadStatement, VerifyData } from './steps';

import { debitTransactionsApi } from '../../../../../integration/apis';

// type definitions
import type { StepsProps, UploadProps } from 'antd';
import type { ParsedTrx } from '../../../../../integration/apis/debit_transactions';
import type { TableData } from './steps/VerifyData/VerifyData'; // TO DO: check if we can put this on a common types definition
import type { Account } from '../../../../../integration/apis/accounts';

export type TransactionStepperFormProps = {
  accountId: Account['id'] | Account['unique_code'];
};

const stepItems: StepsProps['items'] = [
  {
    title: 'Upload statement',
    description: 'Parse bank statements',
  },
  {
    title: 'Verify data',
    description: 'Verify data parsed from our parser',
  },
  {
    title: 'Finish',
    description: 'You are all set!',
  },
];

const TransactionStepperForm: FC<TransactionStepperFormProps> = (props) => {
  const { accountId } = props;

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [parsedTrx, setParsedTrx] = useState<ParsedTrx[]>([]);

  const [parseStatement] = debitTransactionsApi.useParseStatementMutation();
  const [bulkCreate] = debitTransactionsApi.useBulkCreateMutation();

  const _customFileUploadHandler: UploadProps['customRequest'] = async (
    options
  ) => {
    const { file } = options;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await parseStatement(formData).unwrap();
      setParsedTrx(data);
      setCurrentStep(currentStep + 1);
    } catch (err) {
      console.log('err', err);
    }
  };

  const _postTransactionsHandler = async (tableData: TableData[]) => {
    await bulkCreate({
      records: tableData,
      account_id: accountId,
    });
    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      <Row>
        <Steps
          items={stepItems}
          current={currentStep}
        />
      </Row>
      <Row style={{ marginTop: 20 }}>
        {currentStep === 0 && (
          <UploadStatement fileUploadHandler={_customFileUploadHandler} />
        )}
        {currentStep === 1 && (
          <VerifyData
            parsedData={parsedTrx}
            onSubmitCallback={({ tableData }) => {
              _postTransactionsHandler(tableData);
            }}
          />
        )}
        {currentStep === 2 && (
          <Flex
            justify='center'
            align='center'
            style={{ width: '100%' }}
          >
            <Result
              status='success'
              title='Successfully created transactions'
            />
          </Flex>
        )}
      </Row>
    </>
  );
};

export default TransactionStepperForm;
