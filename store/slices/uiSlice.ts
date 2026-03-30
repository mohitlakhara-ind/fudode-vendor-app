import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isModalOpen: boolean;
}

const initialState: UIState = {
  isModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
  },
});

export const { setModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
