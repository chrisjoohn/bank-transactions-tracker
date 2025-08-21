import { createContext, useState } from 'react';

import type { StepsProps } from 'antd';

import type { ParsedTrx } from '../../integration/types';
import type { EditableCreditTransaction } from '../../integration/apis/creditTransactions';
import type { EditableDebitTransaction } from '../../integration/apis/debitTransactions';

interface TransactionStepperFormContextType {
  formControls: {
    stepItems: StepsProps['items'];
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
  };
  parsedTransactions: {
    data: ParsedTrx[];
    setData: (data: ParsedTrx[]) => void;
  };
  normalizedTransactions: {
    data: EditableCreditTransaction[] | EditableDebitTransaction[];
    setData: (data: EditableCreditTransaction[] | EditableDebitTransaction[]) => void;
  };
}

export const TransactionStepperFormContext = createContext<
  Partial<TransactionStepperFormContextType>
>({});

const stepItems: StepsProps['items'] = [
  {
    title: 'Upload statement',
    description: 'Parse bank statements',
  },
  {
    title: 'Verify data',
    description: 'Verify data parsed from our parser',
  },
  {
    title: 'Finish',
    description: 'You are all set!',
  },
];

export const TransactionStepperFormContextWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, _setCurrentStep] = useState<number>(0);
  const [parsedTransactions, _setParsedTransactions] = useState<ParsedTrx[]>([]);
  const [normalizedTransactions, _setNormalizedTransactions] = useState<
    EditableCreditTransaction[] | EditableDebitTransaction[]
  >([]);

  // TODO: implement this one
  // const setError = (msg: string) => {};

  const nextStep = () => {
    if (currentStep >= stepItems.length - 1) {
      return;
    }

    _setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep <= 0) {
      return;
    }

    _setCurrentStep(currentStep - 1);
  };

  const setParsedTrx = (data: ParsedTrx[]) => {
    _setParsedTransactions(data);
  };

  const setNormalizedTrx = (data: EditableCreditTransaction[] | EditableDebitTransaction[]) => {
    _setNormalizedTransactions(data);
  };

  return (
    <TransactionStepperFormContext.Provider
      value={{
        formControls: {
          nextStep,
          prevStep,
          currentStep,
          stepItems,
        },
        parsedTransactions: {
          data: parsedTransactions,
          setData: setParsedTrx,
        },
        normalizedTransactions: {
          data: normalizedTransactions,
          setData: setNormalizedTrx,
        },
      }}
    >
      {children}
    </TransactionStepperFormContext.Provider>
  );
};
