import { configureStore } from '@reduxjs/toolkit';

import * as APIs from './apis';

export const store = configureStore({
  reducer: {
    // add reducers here
    [APIs.accountsApi.reducerPath]: APIs.accountsApi.reducer,
    [APIs.debitTransactionsApi.reducerPath]: APIs.debitTransactionsApi.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({ serializableCheck: false }).concat(
      APIs.accountsApi.middleware,
      APIs.debitTransactionsApi.middleware
    );
  },
});
