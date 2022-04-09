import { Note } from '@prisma/client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { NoteAPICreateRequest, NoteAPIRequest, NoteAPIResponse, TagAPIResponse } from './types';

export type SerialisedNote = Omit<Note, "createdAt" | "updatedAt"> & { createdAt: string, updatedAt: string }

export const noteApi = createApi({
    reducerPath: "noteApi",
    tagTypes: ["Notes", "Note", "Tags"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api"}),
    endpoints: (builder) => ({
        getNote: builder.query<NoteAPIResponse, number | string | undefined>({
            query: (id) => `/note/${id || 0}`,
            providesTags: (result, error, id) => [{ type: "Note", id }] 
        }),
        getNotes: builder.query<NoteAPIResponse[], { tags?: string[], search?: string }>({
            query: ({ tags, search }) => `/note?${tags ? `${convertTagArrayToQueryString(tags)}` : ""}${search ? `&search=${search}` : ""}`,
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
        getTags: builder.query<TagAPIResponse[], { tags?: string[] }>({
            query: ({ tags }) => `/tag?${tags && convertTagArrayToQueryString(tags) || ""}`,
            providesTags: ["Tags"]
        })
    })
})

function convertTagArrayToQueryString(tags: string[]) {
    let queryStr = "";
    for (let i = 0; i < tags.length; i++) {
        queryStr += `tag=${tags[i]}`;
        if (i < tags.length - 1) {
            queryStr += "&";
        }
    }
    return queryStr;
}

export const { 
    useGetNoteQuery, 
    useGetNotesQuery, 
    useCreateNoteMutation, 
    useUpdateNoteMutation, 
    useDeleteNoteMutation, 
    useGetTagsQuery 
} = noteApi;
