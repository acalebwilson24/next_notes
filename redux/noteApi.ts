import { Note } from '@prisma/client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const noteApi = createApi({
    reducerPath: "noteApi",
    tagTypes: ["Notes"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api"}),
    endpoints: (builder) => ({
        getNotes: builder.query<Note[], undefined>({
            query: () => "/user/notes",
            providesTags: ["Notes"]
        }),
        createNote: builder.mutation<Note, any>({
            query: () => ({
                url: `/user/notes`,
                method: "POST"
            }),
            invalidatesTags: ["Notes"]
        }),
        updateNote: builder.mutation<Note, Note>({
            query: (note) => ({
                url: "/user/notes",
                method: "PUT",
                body: note
            }),
            invalidatesTags: ["Notes"]
        })
    })
})

export const { useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation } = noteApi;
