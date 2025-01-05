import { FC } from 'react';
import classNames from 'classnames';
import { useParams, useNavigate } from 'react-router-dom';

import { Spin, Button } from 'antd';

import { accountsApi } from '../../../integration/apis';

const AccountDetails: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isFetching } = accountsApi.useGetAccountQuery(id || '');

  if (isFetching) {
    return <Spin size='large' />;
  }

  if (!data) {
    return <h2>Error 404: Account Not Found</h2>;
  }

  const { name, description } = data;

  return (
    <div className={classNames('btt-account-details')}>
      <Button onClick={() => navigate(-1)}>Back</Button>
      <h2>{name}</h2>
      <p>{description}</p>
    </div>
  );
};

export default AccountDetails;
