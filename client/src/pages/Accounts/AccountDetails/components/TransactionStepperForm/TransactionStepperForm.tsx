import { FC, useState } from 'react';

import { Flex, Result, Row, Steps } from 'antd';
import { UploadStatement, VerifyData } from './steps';

import { debitTransactionsApi } from '../../../../../integration/apis';

// type definitions
import type { StepsProps, UploadProps } from 'antd';
import type { ParsedTrx } from '../../../../../integration/apis/debit_transactions';

export type TransactionStepperFormProps = {};

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

const TransactionStepperForm: FC<TransactionStepperFormProps> = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [parsedTrx, setParsedTrx] = useState<ParsedTrx[]>([]);

  const [parseStatement] = debitTransactionsApi.useParseStatementMutation();

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
            onSubmitCallback={() => {
              setCurrentStep(currentStep + 1);
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
