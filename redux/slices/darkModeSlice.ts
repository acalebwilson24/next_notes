import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
    name: "darkMode",
    initialState: false,
    reducers: {
        toggleDarkMode(state) {
            return !state
        },
    }
})

export const { toggleDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;