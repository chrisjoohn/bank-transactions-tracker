import { FC, useState } from 'react';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Steps, Table, Upload } from 'antd';
import { debitTransactionsApi } from '../../../../../integration/apis';

import type { ParsedTrx } from '../../../../../integration/apis/debit_transactions';

import type { StepsProps, UploadProps } from 'antd';

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

  const _customRequest: UploadProps['customRequest'] = async (options) => {
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
          <Flex
            justify='center'
            align='center'
            style={{ width: '100%' }}
          >
            <Upload.Dragger
              name='file'
              accept='.pdf'
              customRequest={_customRequest}
              showUploadList={false}
            >
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Upload.Dragger>
          </Flex>
        )}
        {currentStep === 1 && (
          <div>
            <Table<ParsedTrx>
              scroll={{
                y: 500,
              }}
              sticky
              pagination={false}
              size='large'
              style={{ width: '100%' }}
              dataSource={parsedTrx}
              columns={[
                {
                  title: 'Transaction Date',
                  dataIndex: 'date',
                },
                {
                  title: 'Description',
                  render: (_, data) => `${data.description} ${data.details}`
                },
                {
                  title: 'Transaction type',
                  render: (_, data) => {
                    if (data.credit_amount) {
                      return 'CREDIT';
                    }
                    if (data.debit_amount) {
                      return 'DEBIT';
                    }

                    return 'INVALID';
                  },
                },
                {
                  title: 'Amount',
                  render: (_, data) => {
                    return data.credit_amount || data.debit_amount;
                  },
                },
              ]}
            />

            <Button
              onClick={() => {
                if (currentStep < stepItems.length - 1) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              style={{ marginTop: 20 }}
            >
              {currentStep < stepItems.length - 1 ? 'Next' : 'Close'}
            </Button>
          </div>
        )}
      </Row>
      <Row></Row>
    </>
  );
};

export default TransactionStepperForm;
