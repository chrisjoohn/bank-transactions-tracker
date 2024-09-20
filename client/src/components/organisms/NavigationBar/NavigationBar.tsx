import { FC } from 'react';
import classNames from 'classnames';

//components
import PillGroup, { PillGroupProps } from '../../molecules/PillGroup';
import Avatar, { AvatarProps } from '../../atoms/Avatar';

export type NavigationBarProps = {
  pillGroupProps: PillGroupProps;
  avatarProps: AvatarProps;
  logo: string;

  orientation?: 'vertical' | 'horizontal';
};

import './navigationBar.styles.scss';

const NavigationBar: FC<NavigationBarProps> = (props) => {
  const { pillGroupProps, avatarProps, orientation = 'horizontal' } = props;

  const _pillGroupProps = {
    ...pillGroupProps,
    orientation,
  };

  return (
    <div className={classNames(`btt-navigation-bar`, orientation)}>
      <div className='left'>
        <PillGroup {..._pillGroupProps} />
      </div>
      <div className='right'>
        <Avatar {...avatarProps} />
      </div>
    </div>
  );
};

export default NavigationBar;
