import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import type { Account } from '../apis/accounts';
import type { RootState } from '../store';

const accountsAdapter = createEntityAdapter({
  selectId: (tag: Account) => tag.id,
});

const initialState = accountsAdapter.getInitialState();

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setMany: accountsAdapter.setMany,
    setOne: accountsAdapter.setOne,
    addOne: accountsAdapter.addOne,
  },
});

export const accountsSliceActions = accountsSlice.actions;

export const tagSelectors = accountsAdapter.getSelectors((state: RootState) => {
  return state.accounts;
});

export default accountsSlice;
