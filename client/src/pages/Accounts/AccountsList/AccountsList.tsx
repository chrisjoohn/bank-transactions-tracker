import { FC } from 'react';

// components
import { Button, Modal } from 'antd';

import { AccountForm, AccountList } from '../../../features';

// hooks
import { useModal } from '../../../hooks';

const AccountsList: FC = () => {
  const { showModal, toggleModal } = useModal();

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <Button style={{ marginLeft: 'auto' }} onClick={() => toggleModal(true)}>
        Add Account
      </Button>
      <Modal open={showModal} footer={null} onCancel={() => toggleModal()}>
        <AccountForm />
      </Modal>
      <AccountList />
    </div>
  );
};

export default AccountsList;
