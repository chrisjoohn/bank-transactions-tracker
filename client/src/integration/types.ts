export interface BaseEntityType {
  id: number;
  unique_code: string;

  created_at: string;
  created_by: number;

  updated_at: string;
  updated_by: number;

  archived_at: string;
  acrhived_by: number;
}

export type ParsedCreditTrx = {
  transaction_date: string;
  post_date: string;
  description: string;
  amount: string;
};

export type ParsedDebitTrx = {
  date: string;
  ref: string;
  details: string;
  running_balance: string;
  description: string;
  debit_amount?: string;
  credit_amount?: string;
};

export type ParsedTrx = ParsedDebitTrx | ParsedCreditTrx;

export type Editable<
  T extends BaseEntityType,
  K extends keyof T = never
> = Partial<BaseEntityType> & Omit<T, keyof BaseEntityType | K> & Partial<Pick<T, K>>;

