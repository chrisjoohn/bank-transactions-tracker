import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

import type { BaseEntityType, Editable } from '../types';
import { Account } from './accounts';

// TODO: create base AppData type defintion
export interface Tag extends BaseEntityType {
  name: string;
}

export interface TransactionTag extends BaseEntityType {
  transaction_id: string | number;
  tag_id: Tag['id'];

  tag?: Tag;
}

export type EditableTag = Editable<Tag>;
export type EditableTransactionTag = Editable<TransactionTag>;

export const tagsApi = createApi({
  reducerPath: 'tags',
  tagTypes: ['Tags'],
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
      transformResponse: (response: { data: Tag }) => response.data,
      async onQueryStarted(requestBody, { dispatch, queryFulfilled }) {
        const tempId = Date.now().toString();
        const patchResult = dispatch(
          tagsApi.util.updateQueryData('getTags', undefined, (items) => {
            // TODO: Fix type on this ene
            // items.push({
            //   ...requestBody,
            //   unique_code: tempId,
            //   id: 0,
            // });
          })
        );

        try {
          const { data: createdTag } = await queryFulfilled;
          dispatch(
            tagsApi.util.updateQueryData('getTags', undefined, (items) => {
              const idx = items.findIndex((item) => item.unique_code === tempId);
              items[idx] = createdTag;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateTag: builder.mutation<Tag, { id: string; requestBody: Tag }>({
      query: ({ id, requestBody }) => ({
        url: `/tags/${id}`,
        method: 'PUT',
        body: requestBody,
      }),
      async onQueryStarted({ id, requestBody }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData('getTags', undefined, (items) => {
            const idx = items.findIndex((item) => item.unique_code === id);
            if (idx > -1) {
              items[idx] = {
                ...items[idx],
                ...requestBody,
              };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTag: builder.mutation<null, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: 'DELETE',
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tagsApi.util.updateQueryData('getTags', undefined, (items) => {
            const idx = items.findIndex((item) => item.unique_code === id);
            if (idx > -1) {
              items.splice(idx, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    createTransactionTag: builder.mutation<
      TransactionTag,
      { account_id: Account['id'] | Account['unique_code']; body: EditableTransactionTag }
    >({
      query: ({ account_id, body }) => ({
        url: `/accounts/${account_id}/transaction-tags`,
        method: 'POST',
        body: body,
      }),
    }),

    deleteTransactionTags: builder.mutation<
      void,
      { accountId: Account['unique_code']; transactionTagId: TransactionTag['unique_code'] }
    >({
      query: ({ accountId, transactionTagId }) => ({
        url: `/accounts/${accountId}/transaction-tags/${transactionTagId}`,
        method: 'DELETE',
      }),
    }),
  }),
});
