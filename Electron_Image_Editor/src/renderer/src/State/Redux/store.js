import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Slices/counterSlice'
import loadingSlice from './Slices/loadingSlice'

export const store = configureStore({
  reducer: {
    counter : counterSlice,
    loading: loadingSlice,
  },
})