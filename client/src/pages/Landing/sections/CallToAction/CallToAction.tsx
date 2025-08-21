import { FC } from 'react';

import { Button } from 'antd';

import './callToAction.styles.scss';

const CallToAction: FC = () => {
  return (
    <section className="cta">
      <div className="title">Take control of your money today.</div>
      <div className="description">
        Start tracking, tagging, and understanding your cashflow — free.
      </div>
      <Button>Sign Up Free</Button>
    </section>
  );
};

export default CallToAction;
