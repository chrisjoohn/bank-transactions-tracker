import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Spin } from 'antd';

// redux APIs
import { accountsApi } from '../../../integration/apis';

const AccountsList: FC = () => {
  const { isLoading, data = [] } = accountsApi.useGetAccountsQuery();

  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      {isLoading ? (
        <Spin size='large' />
      ) : (
        data.map((item) => {
          return (
            <Card
              key={item.name}
              extra={item.type}
              hoverable
              style={{ flex: '1 1 0px' }}
              onClick={() => navigate(`/${item.unique_code}`)}
            >
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default AccountsList;
