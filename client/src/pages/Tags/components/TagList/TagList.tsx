import { FC } from 'react';

import { message } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';

import { Card, List } from 'antd';

import { tagsApi } from '../../../../integration/apis/tags';

import type { Tag } from '../../../../integration/apis/tags';

export type TagListProps = {};

const TagList: FC<TagListProps> = (props) => {
  const {} = props;

  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading } = tagsApi.useGetTagsQuery();
  const [deleteTag] = tagsApi.useDeleteTagMutation();

  const _deleteTagHandler = (tag: Tag) => {
    messageApi.info(`Deleted tag: ${tag.name}`);
    deleteTag(tag.unique_code);
  };

  return (
    <>
      {contextHolder}
      <Card>
        <List
          dataSource={data}
          loading={isLoading}
          renderItem={(item) => (
            <List.Item
              actions={[
                <DeleteOutlined
                  style={{ cursor: 'pointer' }}
                  onClick={() => _deleteTagHandler(item)}
                />,
              ]}
            >
              {item.name}
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default TagList;
