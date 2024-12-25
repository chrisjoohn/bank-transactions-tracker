import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
	reducer: {
		// add reducers here
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware().concat();
	},
});