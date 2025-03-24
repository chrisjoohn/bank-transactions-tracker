import TransactionStepperForm, {
  TransactionStepperFormProps,
} from './TransactionStepperForm';
import { TransactionStepperFormContextWrapper } from './TransactionStepperFormContext';

export default (props: TransactionStepperFormProps) => (
  <TransactionStepperFormContextWrapper>
    <TransactionStepperForm {...props} />
  </TransactionStepperFormContextWrapper>
);
