import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { CreditTransaction } from '../apis/creditTransactions';
import { DebitTransaction } from '../apis/debitTransactions';
import { RootState } from '../store';

const transactionsAdapter = createEntityAdapter({
  selectId: (transaction: CreditTransaction | DebitTransaction) => transaction.unique_code,
});

const initialState = transactionsAdapter.getInitialState();

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setMany: transactionsAdapter.setMany,
    setOne: transactionsAdapter.setOne,
  },
});

export const transactionSliceActions = transactionsSlice.actions;

export const transactionSelectors = transactionsAdapter.getSelectors((state: RootState) => {
  return state.transactions;
});

export default transactionsSlice;
