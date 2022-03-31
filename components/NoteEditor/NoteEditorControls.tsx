import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { SerialisedNote, useGetTagsQuery } from "../../redux/noteApi";
import { InflatedNote, TagAPIResponse } from "../../redux/types";
import { filterTags } from "../../utils/tag";
import InflatedNoteCard from "../Note/NoteCard";
import TagButton from "../TagButton";
import { TagAutoComplete } from "./NoteEditorMain";
import styles from './styles/NoteEditorControls.module.css';

type LeftColumnProps = {
    search: string
    setSearch: { (s: string): void }
    isError: boolean
    isLoading: boolean
    inflatedNotes: (SerialisedNote | InflatedNote)[]
    id?: number
    mobile: boolean
    createNewNote: {(): void}
    tags: string[],
    setTags: {(t: string[]): void}
}

const NoteEditorControls: React.FC<LeftColumnProps> = ({ search, setSearch, isError, inflatedNotes, id, isLoading, mobile, createNewNote, tags, setTags: _setTags }) => {
    const session = useSession();
    const router = useRouter();
    const topBarRef = useRef<HTMLDivElement | null>(null)
    const { data: userTags, isFetching } = useGetTagsQuery({ tags }, { skip: !session?.data?.user.id });

    const [newTag, setNewTag] = useState("");

    function removeTag(t: string) {
        const newTags = tags.filter(tag => tag !== t);
        setTags(newTags);
    }
    
    function setTags(newTags: string[]) {
        _setTags(newTags);
    }

    
    
    useEffect(() => {
        console.log(isFetching && "fetching")
    }, [isFetching])

    return (
        <div className={`flex flex-col h-full`}>
            <div className={mobile ? "w-full" : ""} ref={topBarRef}>
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
                    <Link href="/" passHref><a className="bg-sky-600 text-white dark:bg-sky-700 w-full block text-center py-1">New</a></Link>
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
                                    <NoteList notes={inflatedNotes} pathname={router.pathname} selected={id || 0} /> :
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
    pathname: string,
    selected?: number
}

const NoteList: React.FC<Props> = ({ notes, pathname, selected }) => {
    return (
        <div className="flex flex-col">
            {notes.map(n => <Link key={n.id} href={`${pathname}?id=${n.id}`}><a className="border-b border-slate-200 dark:border-slate-600"><NoteListItem {...n} selected={n.id == selected} /></a></Link>) || null}
        </div>
    )
}

const NoteListItem: React.FC<(SerialisedNote | InflatedNote) & { selected: boolean }> = (note) => {
    return <InflatedNoteCard {...note as InflatedNote} selected={note.selected} />
}