import { FC } from 'react';

import './pill.styles.scss';

export type PillProps = {
  label: string;
  onClick?: () => void;
};

const NavItem: FC<PillProps> = (props) => {
  const { label, onClick } = props;
  return (
    <div
      className='btt-pill'
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default NavItem;
