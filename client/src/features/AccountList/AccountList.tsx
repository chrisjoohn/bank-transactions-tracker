import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// components
import { Divider, Spin } from 'antd';

import { AccountCard } from '../../pages/Accounts/components';

// redux
import { accountsApi } from '../../integration/apis';
import { accountSelectors } from '../../integration/slices/accounts.slice';

// types
import type { Account } from '../../integration/apis/accounts';
import type { RootState } from '../../integration/store';

const List: FC<{
  data: Account[];
}> = (props) => {
  const { data } = props;
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        {data.map((item) => {
          return (
            <AccountCard
              key={item.unique_code}
              account={item}
              onClick={() => navigate(`/${item.unique_code}`)}
            />
          );
        })}
      </div>
    </div>
  );
};

const AccountList: FC = () => {
  const { isLoading } = accountsApi.useGetAccountsQuery();
  const data = useSelector((state: RootState) => accountSelectors.selectAll(state));

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

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <List data={creditAccounts} />
      <Divider />
      <List data={debitAccounts} />
    </>
  );
};

export default AccountList;
