import { FC, useContext } from 'react';

import { TransactionStepperFormContext } from './TransactionStepperFormContext';

import { Flex, Result, Row, Steps } from 'antd';
import { UploadStatement, VerifyData } from './steps';

// type definitions
import { Account } from '../../integration/apis/accounts';

export type TransactionStepperFormProps = {
  account: Account;
};

const TransactionStepperForm: FC<TransactionStepperFormProps> = (props) => {
  const { account } = props;

  const { formControls } = useContext(TransactionStepperFormContext);
  const { stepItems = [], currentStep = 0 } = formControls || {};

  return (
    <>
      <Row>
        <Steps items={stepItems} current={currentStep} />
      </Row>
      <Row style={{ marginTop: 20 }}>
        {currentStep === 0 && <UploadStatement accountId={account.id} />}
        {currentStep === 1 && <VerifyData account={account} />}
        {currentStep === 2 && (
          <Flex justify="center" align="center" style={{ width: '100%' }}>
            <Result status="success" title="Successfully created transactions" />
          </Flex>
        )}
      </Row>
    </>
  );
};

export default TransactionStepperForm;
