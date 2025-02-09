import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

export type DebitTransaction = {
  id: number;
  unique_code: string;
  //   user_id: string;
  //   name: string;
  //   description: string;
  //   type: 'DEPOSIT' | 'CREDIT';
};

export type ParsedTrx = {
  date: string;
  description: string;
  details: string;
  ref: string;
};

export type CreditTrx = {
  credit_amount: string;
} & ParsedTrx;

export type DebitTrx = {
  debit_amount: string;
} & ParsedTrx;

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
    parseStatement: builder.mutation<CreditTrx[] | DebitTrx[], FormData>({
      query: (formData) => ({
        url: `/debit_transactions/parse-statement`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: { data: CreditTrx[] | DebitTrx[] }) => {
        console.log('response', response);
        return response.data;
      },
    }),
  }),
});
