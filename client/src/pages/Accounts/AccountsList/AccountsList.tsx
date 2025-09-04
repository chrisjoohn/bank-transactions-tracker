import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// components
import { Card, Spin, Divider, Button, Modal } from 'antd';

import { AccountForm } from '../../../features';

// hooks
import { useModal } from '../../../hooks';

// redux slices
import { accountSelectors } from '../../../integration/slices/accounts.slice';

// redux APIs
import { accountsApi } from '../../../integration/apis';
import { RootState } from '../../../integration/store';

// TODO: separate UI from logic
const AccountsList: FC = () => {
  const navigate = useNavigate();

  const { isLoading } = accountsApi.useGetAccountsQuery();
  const data = useSelector((state: RootState) => accountSelectors.selectAll(state));

  const { showModal, toggleModal } = useModal();

  const creditAccounts = useMemo(() => {
    return data.filter((item) => {
      return item.type === 'CREDIT';
    });
  }, [data]);

  const debitAccounts = useMemo(() => {
    return data.filter((item) => {
      return item.type === 'DEPOSIT';
    });
  }, [data]);

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      <Button style={{ justifySelf: 'flex-end' }} onClick={() => toggleModal(true)}>
        Add Account
      </Button>
      <Modal open={showModal} footer={null} onCancel={() => toggleModal()}>
        <AccountForm />
      </Modal>
      {isLoading ? (
        <Spin size="large" />
      ) : (
        // TODO: Refactor this list
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            {creditAccounts.map((item) => {
              return (
                <Card
                  key={item.name}
                  extra={item.type}
                  hoverable
                  style={{ flex: '0 0 calc(33.33% - 20px)' }}
                  onClick={() => navigate(`/${item.unique_code}`)}
                >
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </Card>
              );
            })}
          </div>
          <Divider />
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 20,
            }}
          >
            {debitAccounts.map((item) => {
              return (
                <Card
                  key={item.name}
                  extra={item.type}
                  hoverable
                  style={{ flex: '0 0 calc(33.33% - 20px)' }}
                  onClick={() => navigate(`/${item.unique_code}`)}
                >
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsList;
