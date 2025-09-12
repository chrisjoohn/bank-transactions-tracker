import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

import { transactionSliceActions } from '../slices/transactions.slice';
import { accountsSliceActions } from '../slices/accounts.slice';

// type definitinos
import type { DebitTransaction, EditableDebitTransaction } from './debitTransactions';
import type { CreditTransaction, EditableCreditTransaction } from './creditTransactions';
import type { BaseEntityType, Editable, ParsedTrx } from '../types';
import type { Tag } from './tags';

export interface Account extends BaseEntityType {
  user_id: string;
  name: string;
  description: string;
  type: 'DEPOSIT' | 'CREDIT';
}

export type EditableAccount = Editable<Account, 'user_id'>;

export interface GroupedTag {
  id: number;
  name: string;
  total_amount: number;
  count: number;
}

export const accountsApi = createApi({
  reducerPath: 'accounts-rtk',
  tagTypes: ['Accounts', 'Transactions'],
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
    createAccount: builder.mutation<Account, EditableAccount>({
      query: (requestBody: EditableAccount) => ({
        url: `/accounts`,
        method: 'POST',
        body: requestBody,
      }),
      transformResponse: (response: { data: Account }) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(accountsSliceActions.addOne(data));
        } catch {
          // optional rollback
        }
      },
    }),
    getAccounts: builder.query<Account[], void>({
      query: () => `/accounts`,
      transformResponse: (response: { data: Account[] }) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(accountsSliceActions.setMany(data));
        } catch {
          // optional rollback
        }
      },
    }),
    getAccount: builder.query<Account, string>({
      query: (id) => `/accounts/${id}`,
      transformResponse: (response: { data: Account }) => response.data,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(accountsSliceActions.setOne(data));
        } catch {
          // optional rollback
        }
      },
    }),

    /**
     * Transaction related
     */
    getTransactions: builder.query<
      DebitTransaction[] | CreditTransaction[],
      {
        id: Account['id'] | Account['unique_code'];
        requestBody: {
          filters: { date_range?: { start_date: string; end_date: string }; tags?: number[] };
          includes?: { [includeKey: string]: {} };
        };
      }
    >({
      query: ({ id, requestBody }) => ({
        url: `/accounts/${id}/transactions`,
        method: 'POST',
        body: requestBody,
      }),
      transformResponse: (response: { data: DebitTransaction[] | CreditTransaction[] }) =>
        response.data,
      providesTags: (result, _, arg) => {
        return result
          ? [
              ...result.map((item) => ({
                type: 'Transactions' as const,
                id: item.unique_code,
              })),
              { type: 'Transactions', id: JSON.stringify(arg) },
            ]
          : [{ type: 'Transactions', id: JSON.stringify(arg) }];
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(transactionSliceActions.setMany(data));
        } catch {
          // optional rollback
        }
      },
    }),
    getTotalPerTag: builder.query<
      GroupedTag[],
      {
        id: Account['unique_code'];
        requestBody: {
          filters: {
            post_date?: {
              start_date: string;
              end_date: string;
            };
            tags?: number[];
          };
        };
      }
    >({
      query: ({ id, requestBody }) => ({
        url: `/accounts/${id}/analytics/total-per-tag`,
        method: 'POST',
        body: requestBody,
      }),
      transformResponse: (response: { data: GroupedTag[] }) => response.data,
    }),
    getTransaction: builder.query<
      DebitTransaction | CreditTransaction,
      { id: Account['unique_code']; transactionId: string }
    >({
      query: ({ id, transactionId }) => ({
        url: `/accounts/${id}/transactions/${transactionId}`,
      }),
      transformResponse: (response: { data: DebitTransaction | CreditTransaction }) =>
        response.data,
      providesTags: (result) => {
        return [{ type: 'Transactions', id: result?.unique_code }];
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(transactionSliceActions.setOne(data));
        } catch {
          // optional rollback
        }
      },
    }),
    getAccountTrxAnalytics: builder.query<
      { data: { totalOutflow: number; totalInflow: number; total: number } },
      {
        id?: Account['id'] | Account['unique_code'];
        post_date?: { start_date: string; end_date: string };
        transaction_date?: { start_date: string; end_date: string };
        tags: Tag['id'][];
      }
    >({
      query: ({ id, post_date, transaction_date, tags }) => ({
        method: 'POST',
        url: `/accounts/${id}/transactions/analytics`,
        body: {
          filters: {
            post_date,
            transaction_date,
            tags,
          },
        },
      }),
    }),
    parseStatement: builder.query<
      ParsedTrx[],
      { id: Account['id'] | Account['unique_code']; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/accounts/${id}/parse-statement`,
        method: 'POST',
        body: formData,
      }),
      transformResponse: (response: { data: ParsedTrx[] }) => {
        return response.data;
      },
    }),
    bulkCreateTransactions: builder.mutation<
      CreditTransaction[] | DebitTransaction[],
      {
        id: Account['id'] | Account['unique_code'];
        records: EditableDebitTransaction[] | EditableCreditTransaction[];
      }
    >({
      query: ({ id, records }) => ({
        url: `/accounts/${id}/transactions/bulk-create`,
        method: 'POST',
        body: {
          records,
        },
      }),
      transformResponse: (response: { data: CreditTransaction[] | DebitTransaction[] }) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApi;
