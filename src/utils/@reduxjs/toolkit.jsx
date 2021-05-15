import {
  createSlice as createSliceOriginal,
  SliceCaseReducers,
  CreateSliceOptions,
} from '@reduxjs/toolkit';

/* Wrap createSlice with stricter Name options */

/* istanbul ignore next */
export const createSlice = options => {
  return createSliceOriginal(options);
};
