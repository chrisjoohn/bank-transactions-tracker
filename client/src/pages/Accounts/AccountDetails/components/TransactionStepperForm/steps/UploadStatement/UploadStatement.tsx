import { FC, useContext } from 'react';

import { TransactionStepperFormContext } from '../../TransactionStepperFormContext';

// components
import { Flex, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { accountsApi } from '../../../../../../../integration/apis';

// type definitions
import type { UploadProps } from 'antd';
import { Account } from '../../../../../../../integration/apis/accounts';

export type UploadStatementProps = {
  accountId: Account['id'];
};

const UploadStatement: FC<UploadStatementProps> = (props) => {
  const { accountId } = props;

  const [parseStatement] = accountsApi.useLazyParseStatementQuery();

  const { formControls, parsedTransactions } = useContext(
    TransactionStepperFormContext
  );

  const _fileUploadHandler: UploadProps['customRequest'] = async (options) => {
    const { file } = options;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await parseStatement({ id: accountId, formData }).unwrap();
      parsedTransactions?.setData(data);
      formControls?.nextStep();
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <Flex
      justify='center'
      align='center'
      style={{ width: '100%' }}
    >
      <Upload.Dragger
        name='file'
        accept='.pdf'
        customRequest={_fileUploadHandler}
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
  );
};

export default UploadStatement;
