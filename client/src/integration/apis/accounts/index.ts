import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

export type Account = {
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
  }),
});

export const { useGetAccountsQuery } = accountsApi;
