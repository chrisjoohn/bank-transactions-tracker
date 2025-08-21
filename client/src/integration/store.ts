import { configureStore } from '@reduxjs/toolkit';

import * as APIs from './apis';
import * as slices from './slices';

export const store = configureStore({
  reducer: {
    // add reducers here

    // rtk-query APIs
    [APIs.accountsApi.reducerPath]: APIs.accountsApi.reducer,
    [APIs.debitTransactionsApi.reducerPath]: APIs.debitTransactionsApi.reducer,
    [APIs.tagsApi.reducerPath]: APIs.tagsApi.reducer,

    // redux slices
    transactions: slices.transactionsSlice.reducer,
    tags: slices.tagsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat(
      APIs.accountsApi.middleware,
      APIs.debitTransactionsApi.middleware,
      APIs.tagsApi.middleware
    );
  },
});

export type RootState = ReturnType<typeof store.getState>;
