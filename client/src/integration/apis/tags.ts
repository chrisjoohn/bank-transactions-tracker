import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

import type { Editable } from '../types';

// TODO: create base AppData type defintion
export type Tag = {
  id: number;
  unique_code: string;
  name: string;
};

export type EditableTag = Editable<Tag, 'id' | 'unique_code'>; // TODO: make second param default value

export const tagsApi = createApi({
  reducerPath: 'tags',
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
    getTags: builder.query<Tag[], void>({
      query: () => `/tags`,
      transformResponse: (response: { data: Tag[] }) => response.data,
    }),
    createTag: builder.mutation<Tag, EditableTag>({
      query: (requestBody) => ({
        url: `/tags`,
        method: 'POST',
        body: requestBody,
      }),
    }),
    updateTag: builder.mutation<Tag, { id: string; requestBody: Tag }>({
      query: ({ id, requestBody }) => ({
        url: `/tags/${id}`,
        method: 'PUT',
        body: requestBody,
      }),
    }),
    deleteTag: builder.mutation<null, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});
