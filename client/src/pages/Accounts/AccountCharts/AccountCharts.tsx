import { FC } from 'react';
import { useParams } from 'react-router-dom';

import TagChartsBuilder from '../../../features/TagCharts/TagChartsBuilder';

import { accountsApi } from '../../../integration/apis';

const AccountCharts: FC = () => {
  const { id } = useParams();

  if (!id) {
    return null;
  }

  const { data: chartsData } = accountsApi.useGetChartsQuery({ id: id ?? '' });

  return <TagChartsBuilder accountId={id} />;
};

export default AccountCharts;
