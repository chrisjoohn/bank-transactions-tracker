import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

// type definitinos
import type { DebitTransaction } from '../debitTransactions';
import type { CreditTransaction } from '../creditTransactions';

export type Account = {
  id: number;
  unique_code: string;
  user_id: string;
  name: string;
  description: string;
  type: 'DEPOSIT' | 'CREDIT';
};

export const accountsApi = createApi({
  reducerPath: 'accounts',
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
    getAccounts: builder.query<Account[], void>({
      query: () => `/accounts`,
      transformResponse: (response: { data: Account[] }) => response.data,
    }),
    getAccount: builder.query<Account, string>({
      query: (id) => `/accounts/${id}`,
      transformResponse: (response: { data: Account }) => response.data,
    }),
    getTransactions: builder.query<
      DebitTransaction[] | CreditTransaction[],
      {
        id: Account['id'] | Account['unique_code'];
        requestBody: {
          filters: { date_range?: { start_date: string; end_date: string } };
        };
      }
    >({
      query: ({ id, requestBody }) => ({
        url: `/accounts/${id}/transactions`,
        method: 'POST',
        body: requestBody,
      }),
      transformResponse: (response: {
        data: DebitTransaction[] | CreditTransaction[];
      }) => response.data,
    }),
    getAccountTrxAnalytics: builder.query<
      { data: { totalOutflow: number; totalInflow: number; total: number } },
      {
        id?: Account['id'] | Account['unique_code'];
        date_range: { start_date: string; end_date: string };
      }
    >({
      query: ({ id, date_range }) => ({
        url: `/accounts/${id}/transactions/analytics`,
        params: {
          start_date: date_range.start_date,
          end_date: date_range.end_date,
        },
      }),
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApi;
