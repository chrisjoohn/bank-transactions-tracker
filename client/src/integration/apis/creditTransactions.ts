import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuth } from 'firebase/auth';

import { BaseEntityType, Editable } from '../types';
import { TransactionTag } from './tags';

export interface CreditTransaction extends BaseEntityType {
  account_id: number;

  description: string;
  transaction_date: string;
  post_date: string;
  amount: number;

  tags?: TransactionTag[];
}

export type EditableCreditTransaction = Editable<CreditTransaction, 'account_id'>;

export const creditTransactionsApi = createApi({
  reducerPath: 'credit_transactions',
  tagTypes: ['CreditTransactions'],
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
    findOne: builder.query<CreditTransaction, string>({
      query: (id) => ({
        url: `/credit_transactions/${id}`,
      }),
      transformResponse: (response: { data: CreditTransaction }) => response.data,
    }),
  }),
});
