import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loadingState: false
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    toggleLoad: (currentState, payload) => {
      currentState.loadingState = payload.payload
      console.log("Payload:",payload);
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { toggleLoad } = loadingSlice.actions

export default loadingSlice.reducer