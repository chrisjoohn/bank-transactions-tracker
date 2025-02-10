import { FC, useState } from 'react';
import { format, parse } from 'date-fns';

import { InboxOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Steps, Table, Upload } from 'antd';
import { debitTransactionsApi } from '../../../../../integration/apis';

import type {
  DebitTransaction,
  ParsedTrx,
} from '../../../../../integration/apis/debit_transactions';

type TableData = Omit<
  DebitTransaction,
  'id' | 'unique_code' | 'amount' | 'account_id' | 'transaction_type'
> & {
  amount: string;
  transaction_type: 'INFLOW' | 'OUTFLOW' | 'INVALID';
};

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

  const _tableData: TableData[] = parsedTrx.map((item) => {
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
