import { FC } from 'react';

import './pill.styles.scss';

export type PillProps = {
  label: string;
  onClick?: () => void;

  active?: boolean;
};

const NavItem: FC<PillProps> = (props) => {
  const { label, onClick, active } = props;
  return (
    <div
      className={`btt-pill ${active && 'active'}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default NavItem;
