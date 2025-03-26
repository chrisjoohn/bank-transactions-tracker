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

export type Editable<T, K extends keyof T> = Omit<T, K>;
