import { FC } from 'react';

import './features.styles.scss';

const Features: FC = () => {
  return (
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
  );
};

export default Features;
