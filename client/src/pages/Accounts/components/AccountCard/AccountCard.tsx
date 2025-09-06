import { FC, MouseEvent, useState } from 'react';

import { Card, Popconfirm, CardProps } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { Account } from '../../../../integration/apis/accounts';

export interface AccountCardProps {
  account: Partial<Account>;
  onClick?: CardProps['onClick'];
}

const AccountCard: FC<AccountCardProps> = (props) => {
  const { account, onClick } = props;
  const { name, description } = account;

  const [deletePopup, setDeletePopup] = useState(false);

  const _actionHandler = (
    e: MouseEvent<HTMLSpanElement, MouseEvent>,
    action: 'edit' | 'delete'
  ) => {
    e.stopPropagation();
    e.preventDefault();

    setDeletePopup(false);

    switch (action) {
      case 'edit':
        break;

      case 'delete':
        break;
    }
  };

  return (
    <Card
      extra={
        <div style={{ display: 'flex', gap: 10 }}>
          <EditOutlined onClick={(e) => _actionHandler(e, 'edit')} />
          <Popconfirm
            title="Delete account"
            description="Are you sure you want to delete this account?"
            onConfirm={(e) => _actionHandler(e, 'delete')}
            onCancel={(e) => {
              e?.stopPropagation();
              e?.preventDefault();
              setDeletePopup(false);
            }}
            onPopupClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            open={deletePopup}
          >
            <DeleteOutlined
              style={{ color: '#ff4d4f' }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDeletePopup(true);
              }}
            ></DeleteOutlined>
          </Popconfirm>
        </div>
      }
      hoverable
      style={{ flex: '0 0 calc(33.33% - 20px)' }}
      onClick={onClick}
    >
      <h3>{name}</h3>
      <p>{description}</p>
    </Card>
  );
};

export default AccountCard;
