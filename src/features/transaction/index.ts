import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TransactionState {
  walletaddress: string;
}

const initialState: TransactionState = {
  walletaddress: "",
};

export const walletSlice = createSlice({
  name: "walletaddress",
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<string>) => {
      state.walletaddress = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setWalletAddress } = walletSlice.actions;

export default walletSlice.reducer;
