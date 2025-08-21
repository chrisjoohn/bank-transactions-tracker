import { FC } from 'react';

import './overview.styles.scss';

const Overview: FC = () => {
  return (
    <section className="overview">
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
          <div className="step-definition">Step 2: Upload bank statements or CSVs in seconds.</div>
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
  );
};

export default Overview;
