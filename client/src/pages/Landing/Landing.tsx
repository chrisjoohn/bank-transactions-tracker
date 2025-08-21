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
        <section className="features">
          <div className="item">
            <div className="icon"></div>
            <div className="details">
              <div className="name">Multi-account tracking.</div>
              <div className="description">Manage all your banks and cards in one view.</div>
            </div>
          </div>

          <div className="item">
            <div className="icon"></div>
            <div className="details">
              <div className="name">Multi-account tracking.</div>
              <div className="description">Manage all your banks and cards in one view.</div>
            </div>
          </div>
          <div className="item">
            <div className="icon"></div>
            <div className="details">
              <div className="name">Multi-account tracking.</div>
              <div className="description">Manage all your banks and cards in one view.</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
