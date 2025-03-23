import { Editable } from '../types';

export type CreditTransaction = {
  id: number;
  unique_code: string;
  account_id: number;

  description: string;
  transaction_date: string;
  post_date: string;
  amount: number;
};

export type EditableCreditTransaction = Editable<
  CreditTransaction,
  'id' | 'unique_code' | 'account_id'
>;
