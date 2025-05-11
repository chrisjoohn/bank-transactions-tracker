import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';
import { Account } from './accounts';
import type { BaseEntityType, Editable, ParsedDebitTrx } from '../types';
import { Tag } from './tags';

export interface DebitTransaction extends BaseEntityType {
  account_id: number;
  transaction_date: string;
  transaction_type: 'INFLOW' | 'OUTFLOW';
  description: string;
  amount: number;
  
  tags?: Tag[];
}

export type EditableDebitTransaction = Editable<DebitTransaction, 'account_id'> & {
  running_balance?: string; // TODO: to recheck this one as it's just a temp implem
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
      transformResponse: (response: { data: DebitTransaction[] }) => response.data,
      providesTags: (result, error, arg) => {
        return result
          ? [
              ...result.map(({ id }) => ({
                type: 'DebitTransactions' as const,
                id,
              })),
              {
                type: 'DebitTransactions',
                id: JSON.stringify(arg),
              },
            ]
          : [{ type: 'DebitTransactions', id: JSON.stringify(arg) }];
      },
    }),
    findOne: builder.query<DebitTransaction, number | string>({
      query: (id) => `/debit_transactions/${id}`,
      transformResponse: (response: { data: DebitTransaction }) => response.data,
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
