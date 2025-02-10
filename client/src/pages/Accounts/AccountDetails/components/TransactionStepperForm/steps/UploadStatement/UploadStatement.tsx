import { FC } from 'react';

// components
import { Flex, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

// type definitions
import type { UploadProps } from 'antd';
export type UploadStatementProps = {
  fileUploadHandler: UploadProps['customRequest'];
};

const UploadStatement: FC<UploadStatementProps> = (props) => {
  const { fileUploadHandler } = props;

  return (
    <Flex
      justify='center'
      align='center'
      style={{ width: '100%' }}
    >
      <Upload.Dragger
        name='file'
        accept='.pdf'
        customRequest={fileUploadHandler}
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
