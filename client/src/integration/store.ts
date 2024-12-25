import { configureStore } from '@reduxjs/toolkit';

import * as APIs from './apis';

export const store = configureStore({
  reducer: {
    // add reducers here
    [APIs.accountsApi.reducerPath]: APIs.accountsApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(APIs.accountsApi.middleware);
  },
});
