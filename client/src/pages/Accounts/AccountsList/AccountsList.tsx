import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import { Button, Modal } from 'antd';

import { AccountForm, AccountList } from '../../../features';

// hooks
import { useModal } from '../../../hooks';

const AccountsList: FC = () => {
  const { showModal, toggleModal } = useModal();
  const navigate = useNavigate();

  const _submitCallback = (action: 'create' | 'update', accountId: string) => {
    if (action === 'create') {
      navigate(`/${accountId}`);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <Button style={{ marginLeft: 'auto' }} onClick={() => toggleModal(true)}>
        Add Account
      </Button>
      <Modal open={showModal} footer={null} onCancel={() => toggleModal()}>
        <AccountForm submitCallback={_submitCallback} />
      </Modal>
      <AccountList />
    </div>
  );
};

export default AccountsList;
