import { FC } from 'react';

import Pill from '../../atoms/Pill';
import type { PillProps } from '../../atoms/Pill';

import './pillGroup.styles.scss'

export type PillGroupProps = {
  orientation?: 'vertical' | 'horizontal';
  pills: PillProps[];
};

const PillGroup: FC<PillGroupProps> = (props) => {
  const { pills, orientation = 'horizontal' } = props;

  return (
    <div className={`btt-pill-group ${orientation}`}>
      {pills.map((pillProps) => {
        return <Pill {...pillProps} />;
      })}
    </div>
  );
};

export default PillGroup;
