import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import type { Tag } from '../apis/tags';
import type { RootState } from '../store';

const tagsAdapter = createEntityAdapter({
  selectId: (tag: Tag) => tag.unique_code,
});

const initialState = tagsAdapter.getInitialState();

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setMany: tagsAdapter.setMany,
    setOne: tagsAdapter.setOne,
  },
});

export const tagsSliceActions = tagsSlice.actions;

export const tagSelectors = tagsAdapter.getSelectors((state: RootState) => {
  return state.tags;
});

export default tagsSlice;
