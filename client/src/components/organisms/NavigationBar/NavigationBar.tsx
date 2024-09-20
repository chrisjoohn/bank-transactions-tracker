import { FC } from 'react';

//components
import PillGroup, { PillGroupProps } from '../../molecules/PillGroup';
import Avatar, { AvatarProps } from '../../atoms/Avatar';

export type NavigationBarProps = {
  pillGroupProps: PillGroupProps;
  avatarProps: AvatarProps;
  logo: string;
};

import './navigationBar.styles.scss';

const NavigationBar: FC<NavigationBarProps> = (props) => {
  const { pillGroupProps, avatarProps } = props;
  return (
    <div className={`btt-navigation-bar`}>
      <div className='left'>
        <PillGroup {...pillGroupProps} />
      </div>
      <div className='right'>
        <Avatar {...avatarProps} />
      </div>
    </div>
  );
};

export default NavigationBar;
