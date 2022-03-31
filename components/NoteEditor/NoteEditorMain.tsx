import { Editor } from "draft-js"
import React, { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/configureStore"
import { useGetTagsQuery } from "../../redux/noteApi"
import { InflatedNote, TagAPIResponse } from "../../redux/types"
import { filterTags } from "../../utils/tag"
import Button from "../Button/Button"
import TagAutoComplete from "../TagAutoComplete"
import TagButton from "../TagButton"
import styles from './styles/NoteEditorMain.module.css'

type RightColumnProps = {
    note: InflatedNote
    setNote: { (note: InflatedNote): void }
    saveNote: { (): void }
    deleteNote: { (): void }
    addTag: { (tag: string): void }
    removeTag: { (tag: string): void }
}

const NoteEditorMain: React.FC<RightColumnProps> = ({ note, setNote, saveNote, deleteNote, addTag: _addTag, removeTag }) => {
    const [tag, setTag] = useState("");
    const buttonsRef = useRef<HTMLDivElement | null>(null);
    const mobile = useSelector((state: RootState) => state.mobile);
    const { data: allTags, isFetching } = useGetTagsQuery({ });

    function addTag(tag: string) {
        _addTag(tag);
        setTag("");
    }

    const filteredTags = allTags && filterTags(allTags, note.tags, tag) || [];

    return (
        <div className="flex flex-col h-full p-4 pt-0 md:pt-4">
            <div className="flex gap-2 items-center text-sm">
                <div className="flex items-center gap-2">
                    {note.tags && note.tags.map((tag, i) => <TagButton key={tag} deleteTag={() => removeTag(tag)}>{tag}</TagButton>)}
                </div>
                <label>
                    <span className="hidden">New Tag</span>
                    <TagAutoComplete onChange={setTag} value={tag} placeholder="Add Tag..." suggestions={filteredTags} onSubmit={addTag} isFetching={isFetching} />
                </label>
            </div>
            <div className={styles.title}>
                <Editor editorState={note.title} onChange={(e) => setNote({ ...note, title: e })} placeholder="Title" />
            </div>
            <div className={styles.content}>
                <Editor editorState={note.content} onChange={(e) => setNote({ ...note, content: e })} placeholder="Content" />
            </div>
            <div className="flex gap-4 fixed bottom-0 w-full mb-4 z-10 md:static md:mt-auto" ref={buttonsRef}>
                <Button type="primary" handleClick={(e) => { e.preventDefault(); saveNote(); }}>Save</Button>
                <Button type="secondary" handleClick={deleteNote}>Delete</Button>
            </div>
            {mobile && buttonsRef.current && <div style={{ height: buttonsRef.current.offsetHeight }} />}
        </div>
    )
}

export default NoteEditorMain;