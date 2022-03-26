import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = null as boolean | null;

const mobileSlice = createSlice({
    name: "mobile",
    initialState: initialState,
    reducers: {
        setMobile(state, action: PayloadAction<boolean>) {
            return action.payload
        },
    }
})

export const { setMobile } = mobileSlice.actions;
export default mobileSlice.reducer;