import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { useDispatch } from 'react-redux'
import { noteApi } from './noteApi'
import titleSlice from './slices/titleSlice'

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [noteApi.reducerPath]: noteApi.reducer,
        title: titleSlice
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(noteApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export type RootState = ReturnType<typeof store.getState>

setupListeners(store.dispatch)