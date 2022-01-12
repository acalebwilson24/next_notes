import { Note } from '@prisma/client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const noteApi = createApi({
    reducerPath: "noteApi",
    tagTypes: ["Notes", "Note"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api"}),
    endpoints: (builder) => ({
        getNote: builder.query<Note, number | string>({
            query: (id) => `/user/notes/${id}`,
            providesTags: (result, error, id) => [{ type: "Note", id }] 
        }),
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
        }),
        deleteNote: builder.mutation<Note, Note>({
            query: (note) => ({
                url: "/user/notes",
                method: "DELETE",
                body: note
            }),
            invalidatesTags: ["Notes"]
        })
    })
})

export const { useGetNoteQuery, useGetNotesQuery, useCreateNoteMutation, useUpdateNoteMutation, useDeleteNoteMutation } = noteApi;
