import { FC } from 'react';

import './features.styles.scss';

const featureList = [
  {
    icon: '',
    title: 'Multi-account tracking.',
    description: 'Manage all your banks and cards in one view.',
  },
  {
    icon: '',
    title: 'Smart statement import.',
    description: 'Simply drag, drop, and parse CSV or PDF.',
  },
  {
    icon: '',
    title: 'Cashflow insights.',
    description: 'Visualize trends & spot opportunities.',
  },
];

const Features: FC = () => {
  return (
    <section className="features">
      {featureList.map((item) => {
        return (
          <div className="item">
            <div className="icon"></div>
            <div className="details">
              <div className="name">{item.title}</div>
              <div className="description">{item.description}</div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Features;
