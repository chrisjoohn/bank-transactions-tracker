import { FC } from 'react';

import { Button } from 'antd';

// styles
import './landing.styles.scss';

const Landing: FC = () => {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-logo">Logo here</div>
        <div className="hero-text-1">Track Your Bank Transactions.</div>
        <div className="hero-text-2">Understand Your Cashflow</div>
        <div className="hero-buttons">
          <Button>Get Started Free</Button>
          <Button>Learn More</Button>
        </div>
      </section>
      <section className="how-it-works">How it Works</section>
      <section className="features"></section>
    </div>
  );
};

export default Landing;
