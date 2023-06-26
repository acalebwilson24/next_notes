import { Note } from '@prisma/client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type SerialisedNote = Omit<Note, "createdAt" | "updatedAt"> & { createdAt: string, updatedAt: string }

export const noteApi = createApi({
    reducerPath: "noteApi",
    tagTypes: ["Notes", "Note"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api"}),
    endpoints: (builder) => ({
        getNote: builder.query<SerialisedNote, number | string>({
            query: (id) => `/user/notes/${id}`,
            providesTags: (result, error, id) => [{ type: "Note", id }] 
        }),
        getNotes: builder.query<SerialisedNote[], undefined>({
            query: () => "/user/notes",
            providesTags: ["Notes"]
        }),
        createNote: builder.mutation<SerialisedNote, Note | null>({
            query: (note) => ({
                url: `/user/notes`,
                method: "POST",
                body: note
            }),
            invalidatesTags: ["Notes"]
        }),
        updateNote: builder.mutation<SerialisedNote, Note>({
            query: (note) => ({
                url: "/user/notes",
                method: "PUT",
                body: note
            }),
            invalidatesTags: (result, error, note) => [{ type: "Notes" }, { type: "Note", id: note.id}]
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
