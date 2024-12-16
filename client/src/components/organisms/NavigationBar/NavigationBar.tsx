import { FC } from 'react';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';

//components
import PillGroup, { PillGroupProps } from '../../molecules/PillGroup';
import Avatar, { AvatarProps } from '../../atoms/Avatar';

export type NavigationBarProps = {
  logo: string;

  navItems: {
    label: string;
    path: string;
  }[];

  avatarImg: string;
  avatarImgAlt: string;

  orientation?: 'vertical' | 'horizontal';
};

import './navigationBar.styles.scss';

const NavigationBar: FC<NavigationBarProps> = (props) => {
  const {
    orientation = 'horizontal',
    navItems,

    avatarImg,
    avatarImgAlt,
  } = props;

  const navigate = useNavigate();
  const location = useLocation();

  const pillGroupProps: PillGroupProps = {
    pills: navItems.map((item) => {
      return {
        label: item.label,
        onClick: () => navigate(item.path),
        active: location.pathname === item.path,
      };
    }),
    orientation,
  };

  const avatarProps: AvatarProps = {
    imgSrc: avatarImg,
    altTxt: avatarImgAlt,
  };

  return (
    <div className={classNames(`btt-navigation-bar`, orientation)}>
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
