import { FC, useEffect, useMemo, useState } from 'react';
import { Tag as TagComponent } from 'antd';
import { PieChart, ResponsiveContainer, Pie, Cell, Tooltip } from 'recharts';

import { accountsApi } from '../../../../../integration/apis';
import { Account } from '../../../../../integration/apis/accounts';
import { Tag } from '../../../../../integration/apis/tags';

export type TagFilterProps = {
  account: Account;
  // onChangeFilterTag: () =
};

const TagFilter: FC<TagFilterProps> = (props) => {
  const { account } = props;
  const [getTotalPerTag, totalPerTag] = accountsApi.useLazyGetTotalPerTagAnalyticsQuery();

  const [tagFilters, setTagFilters] = useState<Tag['id'][]>([]);

  useEffect(() => {
    getTotalPerTag({
      account_id: account.unique_code,
      tags: tagFilters,
    });
  }, [JSON.stringify(tagFilters)]);

  const dataPerId: {
    [id: number]: {
      name: Tag['name'];
      id: Tag['id'];
    };
  } = useMemo(() => {
    return (totalPerTag?.data || []).reduce((acc, curr) => {
      acc[curr.id] = curr;

      return acc;
    }, {});
  }, [totalPerTag]);

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 85%)`;
  };

  const cellClickHandler = (tagId: Tag['id']) => {
    const tagIdx = tagFilters.findIndex((item) => tagId === item);
    const _tagFilters = [...tagFilters];
    if (tagIdx > -1) {
      _tagFilters.splice(tagIdx, 1);
    } else {
      _tagFilters.push(tagId);
    }
    setTagFilters(_tagFilters);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {tagFilters.length > 0 &&
        tagFilters.map((item) => {
          const tag = dataPerId[item];
          console.log({
            tag,
          });
          return (
            <TagComponent
              key={item}
              onClose={() => {
                cellClickHandler(item);
              }}
              closeIcon
            >
              {item}
            </TagComponent>
          );
        })}
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie data={totalPerTag.data} dataKey="count" innerRadius={80}>
            {totalPerTag.data?.map((item) => {
              return (
                <Cell
                  key={item.id}
                  fill={getRandomColor()}
                  onClick={() => cellClickHandler(item.id)}
                />
              );
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TagFilter;
