import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useGetInflatedNotes from "../../../hooks/useGetInflatedNotes/useGetInflatedNotes";
import useRedirectAnon from "../../../hooks/useRedirectAnon";
import { useCreateNoteMutation, useUpdateNoteMutation, useGetNoteQuery, useDeleteNoteMutation, useGetNotesQuery } from "../../../redux/noteApi";
import { InflatedNote } from "../../../redux/types";
import { getDefaultInflatedNote, inflateNote, inflateNotes, serialiseNote } from "../../../utils/note";

// on navigate to desktop, create new note for editor, unless id is set in which case fetch note
// on navigate to mobile, create no note, wait for selection or new note button, or id is set in which case fetch note and switch to editor

export function useNoteSearch() {
    const [search, setSearch] = useState("")
    const [tags, setTags] = useState<string[]>([]);

    return {
        search,
        setSearch,
        tags,
        setTags
    }
}

export default useNoteSearch;