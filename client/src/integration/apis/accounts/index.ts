import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Account = {
  user_id: string;
  name: string;
  description: string;
  type: 'DEPOSIT' | 'CREDIT';
};

export const accountsApi = createApi({
  reducerPath: 'accounts',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => `/accounts`,
    }),
  }),
});

export const { useGetAccountsQuery } = accountsApi;
