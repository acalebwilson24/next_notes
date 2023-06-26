import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useGetNotesQuery } from "../redux/noteApi"
import { InflatedNote } from "../redux/types";
import { inflateNotes } from "../utils/note";

const useGetInflatedNotes = () => {
    const session = useSession();
    const { data: notes, isLoading, isError } = useGetNotesQuery(undefined, { skip: !session.data?.user })

    const [inflatedNotes, setInflatedNotes] = useState<InflatedNote[]>([])

    useEffect(() => {
        if (notes) {
            setInflatedNotes(inflateNotes(notes));
        }
    }, [notes])

    return {
        inflatedNotes,
        isError,
        isLoading
    }

}

export default useGetInflatedNotes