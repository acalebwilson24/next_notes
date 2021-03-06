import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import useDelaySearch from "../../hooks/useDelaySearch";
import { useGetNotesQuery } from "../../redux/noteApi";
import { inflateNotes, serialiseDescendants } from "../../utils/note";
import useNoteSearch from "./hooks/useNoteSearch";
import NoteEditorFilter from "./NoteEditorFilter";
import NoteList from "./NoteList";
import styles from './styles/NoteEditorControls.module.css';

type LeftColumnProps = {
    id?: number
    mobile: boolean
    openNote: {(id: number): void}
    createBlankNote: () => void
}

const NoteEditorControls: React.FC<LeftColumnProps> = ({ id, mobile, openNote, createBlankNote }) => {
    const session = useSession();
    const noteSearch = useNoteSearch();
    const { search: _search, setSearch: _setSearch, tags, setTags } = noteSearch;

    const { searchValue: search, setSearchValue: setSearch } = useDelaySearch(_setSearch);
    const { data: notes, isLoading, isError } = useGetNotesQuery({ tags, search }, { skip: !session?.data?.user.id });
    const inflatedNotes = notes ? inflateNotes(notes).filter(n => (serialiseDescendants(n.title).length || serialiseDescendants(n.content).length)) : [];

    useEffect(() => {
        if (inflatedNotes && inflatedNotes.length && !id && !mobile) {
            openNote(inflatedNotes[0].id);
        }
    }, [inflatedNotes, mobile])

    return (
        <div className={`flex flex-col h-full`}>
            <div className={mobile ? "w-full" : ""}>
                <NoteEditorFilter search={search} setSearch={setSearch} setTags={setTags} tags={tags} skip={!session?.data?.user.id} />
                {
                    mobile ? 
                    <button className="fixed bottom-0 right-0 mb-4 mr-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md text-xl z-10" onClick={createBlankNote}>+</button> :
                    <button onClick={createBlankNote} className="w-full bg-sky-600 text-white px-2 py-1">New</button>
                }
            </div>
            <div className="flex-grow h-full relative">
                <div className={`${!mobile && "absolute"} top-0 left-0 h-full w-full overflow-auto`}>
                    {
                        session.status == "loading" ?
                            <Message>Loading user...</Message> :
                            isError ?
                                <Message>Error</Message> :
                                inflatedNotes.length ?
                                    <NoteList notes={inflatedNotes} selected={id || 0} setNoteID={openNote}  /> :
                                    isLoading ?
                                        <Message>Loading notes...</Message> :
                                        <Message>No notes</Message>
                    }
                </div>
            </div>
        </div>
    );
}

const Message: React.FC = ({ children }) => <div className={styles.message}><p>{children}</p></div>

export default NoteEditorControls;

