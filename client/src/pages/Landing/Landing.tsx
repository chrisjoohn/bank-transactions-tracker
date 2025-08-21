import { FC } from 'react';

import { Button } from 'antd';

// styles
import './landing.styles.scss';

const Landing: FC = () => {
  return (
    <div className="wrapper">
      <div className="container">
        <section className="hero">
          <div className="hero-logo">Logo here</div>
          <div className="hero-text-1">Track Your Bank Transactions.</div>
          <div className="hero-text-2">Understand Your Cashflow.</div>
          <div className="hero-buttons">
            <Button>Get Started Free</Button>
            <Button>Learn More</Button>
          </div>
        </section>
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
        <section className="features"></section>
      </div>
    </div>
  );
};

export default Landing;
