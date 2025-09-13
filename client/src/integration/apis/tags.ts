import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getAuth } from 'firebase/auth';

// redux
import { tagsSliceActions, tagSelectors } from '../slices/tags.slice';
import { transactionSliceActions, transactionSelectors } from '../slices/transactions.slice';

// types
import type { BaseEntityType, Editable } from '../types';
import type { Account } from './accounts';
import { RootState } from '../store';

// TODO: create base AppData type defintion
export interface Tag extends BaseEntityType {
  name: string;
}

export interface TransactionTag extends BaseEntityType {
  transaction_id: string;
  tag_id: Tag['id'] | Tag['unique_code'];

  tag?: Tag;
}

export type EditableTag = Editable<Tag>;
export type EditableTransactionTag = Editable<TransactionTag>;

export const tagsApi = createApi({
  reducerPath: 'tags-rtk',
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
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(tagsSliceActions.setMany(data));
        } catch {
          // optional rollback
        }
      },
    }),
    createTag: builder.mutation<Tag, EditableTag>({
      query: (requestBody) => ({
        url: `/tags`,
        method: 'POST',
        body: requestBody,
      }),
      transformResponse: (response: { data: Tag }) => response.data,
      // TODO: implement optimistic updates here
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
      async onQueryStarted({ body }, { queryFulfilled, getState, dispatch }) {
        const { transaction_id, tag_id } = body;

        const tag = tagSelectors.selectById(getState() as RootState, tag_id as string);

        const transaction = transactionSelectors.selectById(
          getState() as RootState,
          transaction_id
        );

        try {
          const updatedTransaction = {
            ...transaction,
            tags: transaction?.tags ? [...transaction.tags, tag as Tag] : [tag as Tag],
          };

          dispatch(transactionSliceActions.setOne(updatedTransaction));

          await queryFulfilled;
        } catch {
          // rollback here
          dispatch(transactionSliceActions.setOne(transaction));
        }
      },
    }),

    deleteTransactionTags: builder.mutation<
      void,
      { accountId: Account['unique_code']; tagId: Tag['unique_code']; transactionId: string }
    >({
      query: ({ accountId, transactionId, tagId }) => ({
        url: `/accounts/${accountId}/transaction/${transactionId}/tags/${tagId}`,
        method: 'DELETE',
      }),
      onQueryStarted: async ({ transactionId, tagId }, { dispatch, getState, queryFulfilled }) => {
        const transaction = transactionSelectors.selectById(getState() as RootState, transactionId);

        const updatedTransaction = {
          ...transaction,
          tags: transaction?.tags
            ? transaction.tags.filter((item) => item.unique_code !== tagId)
            : [],
        };

        dispatch(transactionSliceActions.setOne(updatedTransaction));

        try {
          await queryFulfilled;
        } catch {
          // rollback: revert to the original transaction state
          dispatch(transactionSliceActions.setOne(transaction));
        }
      },
    }),
  }),
});
