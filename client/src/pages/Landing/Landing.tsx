import { FC } from 'react';

import * as sections from './sections';

// styles
import './landing.styles.scss';

const Landing: FC = () => {
  return (
    <div className="wrapper">
      <div className="container">
        <sections.Hero />
        <section className="how-it-works">
          <div className="steps">
            <div className="details">
              <div className="step-name">Add your accounts</div>
              <div className="step-definition">
                Step 1: Securely link your bank accounts for streamlined setup.
              </div>
            </div>
            <div className="icon"></div>
          </div>

          <div className="steps">
            <div className="icon"></div>
            <div className="details">
              <div className="step-name">Import transactions.</div>
              <div className="step-definition">
                Step 2: Upload bank statements or CSVs in seconds.
              </div>
            </div>
          </div>

          <div className="steps">
            <div className="details">
              <div className="step-name">Tag & categorize expenses.</div>
              <div className="step-definition">
                Step 3: Organize spending for better cashflow visibility.
              </div>
            </div>
            <div className="icon"></div>
          </div>
        </section>
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
