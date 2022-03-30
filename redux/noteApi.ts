import { Note } from '@prisma/client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NoteAPICreateRequest, NoteAPIRequest, NoteAPIResponse } from './types';

export type SerialisedNote = Omit<Note, "createdAt" | "updatedAt"> & { createdAt: string, updatedAt: string }

export const noteApi = createApi({
    reducerPath: "noteApi",
    tagTypes: ["Notes", "Note", "Tags"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api"}),
    endpoints: (builder) => ({
        getNote: builder.query<NoteAPIResponse, number | string>({
            query: (id) => `/note/${id}`,
            providesTags: (result, error, id) => [{ type: "Note", id }] 
        }),
        getNotes: builder.query<NoteAPIResponse[], undefined>({
            query: () => "/note",
            providesTags: ["Notes"]
        }),
        createNote: builder.mutation<NoteAPIResponse, NoteAPICreateRequest>({
            query: (note) => ({
                url: `/note`,
                method: "POST",
                body: note
            }),
            invalidatesTags: ["Notes", "Tags"]
        }),
        updateNote: builder.mutation<NoteAPIResponse, NoteAPIRequest>({
            query: (note) => ({
                url: `/note/${note.id}`,
                method: "PUT",
                body: note
            }),
            invalidatesTags: (result, error, note) => [{ type: "Notes" }, { type: "Note", id: note.id}, "Tags"]
        }),
        deleteNote: builder.mutation<NoteAPIResponse, NoteAPIRequest>({
            query: (note) => ({
                url: `/note/${note.id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Notes", "Tags"]
        }),
        getTags: builder.query<string[], undefined>({
            query: () => "/tag",
            providesTags: ["Tags"]
        })
    })
})

export const { 
    useGetNoteQuery, 
    useGetNotesQuery, 
    useCreateNoteMutation, 
    useUpdateNoteMutation, 
    useDeleteNoteMutation, 
    useGetTagsQuery 
} = noteApi;
