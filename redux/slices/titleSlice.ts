import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const titleSlice = createSlice({
    name: "title",
    initialState: "Note App",
    reducers: {
        set: (state, action: PayloadAction<string>) => {
            return action.payload
        }
    }
})

export const { set } = titleSlice.actions;
export default titleSlice.reducer;