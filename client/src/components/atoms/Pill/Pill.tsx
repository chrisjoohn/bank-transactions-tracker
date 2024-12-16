import { FC } from 'react';
import classNames from 'classnames';

import './pill.styles.scss';

export type PillProps = {
  label: string;
  onClick?: () => void;

  size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  active?: boolean;
};

const NavItem: FC<PillProps> = (props) => {
  const { label, onClick, active, size = 'md' } = props;
  return (
    <div
      className={classNames(`btt-pill`, active && 'active', `.font-${size}`)}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default NavItem;
