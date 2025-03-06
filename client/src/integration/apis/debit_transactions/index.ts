import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';
import { TableData } from '../../../pages/Accounts/AccountDetails/components/TransactionStepperForm/steps/VerifyData/VerifyData';

export type DebitTransaction = {
  id: number;
  unique_code: string;
  account_id: number;
  transaction_date: string;
  transaction_type: 'INFLOW' | 'OUTFLOW';
  amount: number;
};

export type ParsedTrx = {
  date: string;
  description: string;
  details: string;
  ref: string;
  running_balance: string; // to update this one to be only on DebitTrx
} & (CreditTrx | DebitTrx);

export type CreditTrx = {
  credit_amount: string;
  debit_amount?: never;
};

export type DebitTrx = {
  credit_amount?: never;
  debit_amount: string;
};

export const debitTransactionsApi = createApi({
  reducerPath: 'debit_transactions',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    prepareHeaders: async (headers) => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    findAll: builder.query<DebitTransaction[], void>({
      query: () => `/debit_transactions`,
      transformResponse: (response: { data: DebitTransaction[] }) =>
        response.data,
    }),
    findOne: builder.query<DebitTransaction, number | string>({
      query: (id) => `/debit_transactions/${id}`,
      transformResponse: (response: { data: DebitTransaction }) =>
        response.data,
    }),
    create: builder.query<DebitTransaction, void>({
      query: () => `/debit_transactions`,
    }),
    parseStatement: builder.mutation<ParsedTrx[], FormData>({
      query: (formData) => ({
        url: `/debit_transactions/parse-statement`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: { data: ParsedTrx[] }) => {
        console.log('response', response);
        return response.data;
      },
    }),
    bulkCreate: builder.mutation<
      DebitTransaction[],
      { records: TableData[]; account_id: number | string }
    >({
      query: (formData) => ({
        url: `/debit_transactions/bulk`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: { data: DebitTransaction[] }) => {
        return response.data;
      },
    }),
  }),
});
