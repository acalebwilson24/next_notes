import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useGetNotesQuery } from "../../redux/noteApi"
import { InflatedNote } from "../../redux/types";
import { inflateNotes } from "../../utils/note";

const useGetInflatedNotes = (userID?: number) => {
    const { data: notes, isLoading, isError } = useGetNotesQuery({  }, { skip: !userID })

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