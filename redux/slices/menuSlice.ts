import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const menuSlice = createSlice({
    name: "darkMode",
    initialState: false,
    reducers: {
        openMenu() {
            return true
        },
        closeMenu() {
            return false
        },
        toggleMenu(state) {
            return !state
        }
    }
})

export const { openMenu, closeMenu, toggleMenu } = menuSlice.actions;
export default menuSlice.reducer;