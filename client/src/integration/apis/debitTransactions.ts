import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';
import { Account } from './accounts';
import type { Editable, ParsedDebitTrx } from '../types';

export type DebitTransaction = {
  id: number;
  unique_code: string;
  account_id: number;
  transaction_date: string;
  transaction_type: 'INFLOW' | 'OUTFLOW';
  description: string;
  amount: number;
};

export type EditableDebitTransaction = Editable<
  DebitTransaction,
  'id' | 'unique_code' | 'account_id'
>;

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
    findAll: builder.query<
      DebitTransaction[],
      {
        filters?: {
          account_id?: Account['id'] | Account['unique_code'];
          date_range?: {
            start_date: string;
            end_date: string;
          } | void;
        };
      }
    >({
      query: (requestBody) => ({
        method: 'POST',
        url: `/get/debit_transactions`,
        body: requestBody,
      }),
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
    parseStatement: builder.mutation<ParsedDebitTrx[], FormData>({
      query: (formData) => ({
        url: `/debit_transactions/parse-statement`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: { data: ParsedDebitTrx[] }) => {
        console.log('response', response);
        return response.data;
      },
    }),
    bulkCreate: builder.mutation<
      DebitTransaction[],
      { records: EditableDebitTransaction[]; account_id: number | string }
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
