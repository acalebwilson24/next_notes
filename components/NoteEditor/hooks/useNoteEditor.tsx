import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useGetInflatedNotes from "../../../hooks/useGetInflatedNotes";
import useRedirectAnon from "../../../hooks/useRedirectAnon";
import { useCreateNoteMutation, useUpdateNoteMutation, useGetNoteQuery } from "../../../redux/noteApi";
import { InflatedNote } from "../../../redux/types";
import { getDefaultInflatedNote, inflateNote, serialiseNote } from "../../../utils/note";

function useNoteEditor() {
    const session = useSession();
    const router = useRouter();
    const { id } = router.query;
    useRedirectAnon();

    const [search, setSearch] = useState("")

    // data
    const { inflatedNotes, isLoading, isError } = useGetInflatedNotes();
    const { data: serialisedNote, isError: isNoteError } = useGetNoteQuery(typeof id == "string" ? id : 0, { skip: !session.data?.user })

    // mutations
    const [createNote, { isLoading: isCreating, isSuccess: isCreated, data: createdNote }] = useCreateNoteMutation();
    const [updateNote, { isLoading: isUpdating, isSuccess: isUpdated, data: updatedNote }] = useUpdateNoteMutation();
    
    const [note, setNote] = useState<InflatedNote>();


    useEffect(() => {
        if (!id) {
            return setNote(getDefaultInflatedNote())
        }

        if (serialisedNote) {
            const inflatedNote = inflateNote(serialisedNote);
            if (inflatedNote) {
                setNote(inflatedNote)
            }
        }
    }, [serialisedNote, isLoading, id])

    useEffect(() => {
        if (createdNote) {
            router.push(`${router.pathname}?id=${createdNote.id}`)
        }
    }, [createdNote])

    function save() {
        if (!note) {
            return
        }
        const noteToSave = serialiseNote(note);
        if (note.id == -1) {
            createNote(noteToSave);
        }
        updateNote(noteToSave);
    }

    return {
        search,
        setSearch,
        isError,
        inflatedNotes,
        id,
        note,
        setNote,
        save
    }
}

export default useNoteEditor;