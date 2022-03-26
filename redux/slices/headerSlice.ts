import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const headerSlice = createSlice({
    name: "headerHeight",
    initialState: 0,
    reducers: {
        setHeaderHeight(state, action: PayloadAction<number>) {
            return action.payload
        }
    }
})

export const { setHeaderHeight } = headerSlice.actions;
export default headerSlice.reducer;