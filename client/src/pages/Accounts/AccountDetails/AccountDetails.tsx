import { FC, useEffect } from 'react';
import classNames from 'classnames';

import { useParams, useNavigate } from 'react-router-dom';

const AccountDetails: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate('/');
    }
  }, [id]);

  return (
    <div className={classNames('btt-account-details')}>
      Account details page
    </div>
  );
};

export default AccountDetails;
