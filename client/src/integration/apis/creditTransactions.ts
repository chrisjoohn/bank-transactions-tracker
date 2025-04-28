import { BaseEntityType, Editable } from '../types';

export interface CreditTransaction extends BaseEntityType {
  account_id: number;

  description: string;
  transaction_date: string;
  post_date: string;
  amount: number;
}

export type EditableCreditTransaction = Editable<CreditTransaction, 'account_id'>;
