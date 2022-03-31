import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import useDelaySearch from "../../hooks/useDelaySearch";
import { SerialisedNote, useGetNotesQuery, useGetTagsQuery } from "../../redux/noteApi";
import { InflatedNote, TagAPIResponse } from "../../redux/types";
import { inflateNotes } from "../../utils/note";
import { filterTags } from "../../utils/tag";
import InflatedNoteCard from "../Note/NoteCard";
import TagButton from "../TagButton";
import { useNoteSearch } from "./hooks/useNoteEditor";
import { TagAutoComplete } from "./NoteEditorMain";
import styles from './styles/NoteEditorControls.module.css';

type LeftColumnProps = {
    id?: number
    mobile: boolean
    setNoteID: {(id: number): void}
    createNewNote: () => void
}

const NoteEditorControls: React.FC<LeftColumnProps> = ({ id, mobile, setNoteID, createNewNote }) => {
    const noteSearch = useNoteSearch();
    const { search: _search, setSearch: _setSearch, tags, setTags } = noteSearch;
    
    const session = useSession();
    const { data: userTags, isFetching } = useGetTagsQuery({ tags }, { skip: !session?.data?.user.id });

    const { searchValue: search, setSearchValue: setSearch } = useDelaySearch(_setSearch);
    const { data: notes, isLoading, isError } = useGetNotesQuery({ tags, search }, { skip: !session?.data?.user.id });
    const inflatedNotes = notes ? inflateNotes(notes) : [];

    const [newTag, setNewTag] = useState("");

    useEffect(() => {
        if (notes && !id) {
            setNoteID(notes[0].id);
        }
    }, [notes])
    
    // notes && notes.forEach(n => console.log(n.id));

    function removeTag(t: string) {
        const newTags = tags.filter(tag => tag !== t);
        setTags(newTags);
    }

    return (
        <div className={`flex flex-col h-full`}>
            <div className={mobile ? "w-full" : ""}>
                <div className="md:pb-4 p-4 pb-0 flex flex-col gap-2">
                    <label htmlFor="search" className="flex gap-2 items-center">
                        <span className="hidden">Search</span>
                        <input className="block border border-slate-300 dark:border-slate-600 dark:bg-slate-600 w-full mt-1 py-1 px-2" type="search" value={search} onChange={(e) => setSearch(e.target.value)} id="search" placeholder="Search..." />
                    </label>
                    <div>
                        <div className="flex gap-2 flex-wrap">
                            {tags && tags.map((tag, i) => <TagButton key={tag} deleteTag={() => removeTag(tag)}>{tag}</TagButton>)}
                        </div>
                        <label className="block mt-2 text-sm">
                            <span className="hidden">Tags</span>
                            <TagAutoComplete isFetching={isFetching} placeholder="Tag" suggestions={userTags ? filterTags(userTags, tags, newTag) : []} onSubmit={(tag) => { setTags([...tags, tag]); setNewTag(""); }} onChange={setNewTag} value={newTag} />
                        </label>
                    </div>
                </div>
                {
                    mobile ? 
                    <button className="fixed bottom-0 right-0 mb-4 mr-4 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md text-xl z-10" onClick={createNewNote}>+</button> :
                    <button onClick={createNewNote} className="w-full bg-sky-600 text-white px-2 py-1">New</button>
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
                                    <NoteList notes={inflatedNotes} selected={id || 0} setNoteID={setNoteID}  /> :
                                    isLoading ?
                                        <Message>Loading notes...</Message> :
                                        <Message>No notes</Message>
                    }
                </div>
            </div>
        </div>
    );
}

export default NoteEditorControls;

const Message: React.FC = ({ children }) => <div className={styles.message}><p>{children}</p></div>

type Props = {
    notes: (SerialisedNote | InflatedNote)[],
    selected?: number
    setNoteID: {(id: number): void}
}

const NoteList: React.FC<Props> = ({ notes, selected, setNoteID }) => {
    return (
        <div className="flex flex-col divide-y divide-slate-200 border-b border-slate-200">
            {notes.map(n => <NoteListItem key={n.id} {...n} selected={n.id == selected} onClick={() => setNoteID(n.id)} />) || null}
        </div>
    )
}

const NoteListItem: React.FC<(SerialisedNote | InflatedNote) & { selected: boolean, onClick: () => void }> = ({ onClick, ...note }) => {
    return (
        <button onClick={onClick} className="text-left">
            <InflatedNoteCard {...note as InflatedNote} selected={note.selected} />
        </button>
    )
}