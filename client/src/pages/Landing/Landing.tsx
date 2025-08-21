import { FC } from 'react';

import * as sections from './sections';

// styles
import './landing.styles.scss';

const Landing: FC = () => {
  return (
    <div className="wrapper">
      <div className="container">
        <sections.Hero />
        <sections.Overview />
        <sections.Features />
        <sections.CallToAction />
        <sections.Footer />
      </div>
    </div>
  );
};

export default Landing;
