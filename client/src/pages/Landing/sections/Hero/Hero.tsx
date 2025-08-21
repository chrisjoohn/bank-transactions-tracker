import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'antd';

import './hero.styles.scss';

const Hero: FC = () => {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero-logo">{`<Logo />`}</div>
      <div className="hero-text-1">Track Your Bank Transactions.</div>
      <div className="hero-text-2">Understand Your Cashflow.</div>
      <div className="hero-buttons">
        <Button onClick={() => navigate('/login')}>Get Started Free</Button>
        <Button>Learn More</Button>
      </div>
    </section>
  );
};

export default Hero;
