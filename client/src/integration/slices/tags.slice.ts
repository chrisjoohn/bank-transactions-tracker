import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Tag } from '../apis/tags';
import { RootState } from '../store';

const tagsAdapter = createEntityAdapter({
  selectId: (tag: Tag) => tag.id,
});

const initialState = tagsAdapter.getInitialState();

const tagsSlice = createSlice({
  name: 'tags_slice',
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
