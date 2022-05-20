import React, { useState } from "react"
import { useGetTagsQuery } from "../../redux/noteApi"
import { InflatedNote } from "../../redux/types"
import { filterTags } from "../../utils/tag"
import { SlateEditor } from "../Editor/Editor"
import TagAutoComplete from "../TagAutoComplete"
import TagButton from "../TagButton"
import styles from './styles/NoteEditorMain.module.css'

type RightColumnProps = {
    note?: InflatedNote
    setNote: { (note: InflatedNote): void }
    saveNote: { (): void }
    deleteNote: { (): void }
    addTag: { (tag: string): void }
    removeTag: { (tag: string): void }
    isSaving?: boolean
    isSaved?: boolean
}

// when creating a note, actually create a note on the api with empty title and content
// save note periodically (after a few seconds of inactivity)

const NoteEditorMain: React.FC<RightColumnProps> = ({ note, setNote, addTag: _addTag, removeTag, isSaving, isSaved }) => {
    const [tag, setTag] = useState("");
    const { data: allTags, isFetching } = useGetTagsQuery({ });

    function addTag(tag: string) {
        _addTag(tag);
        setTag("");
    }

    if (!note) {
        return null;
    }

    const filteredTags = allTags && filterTags(allTags, note.tags, tag) || []; 

    return (
        <div className="flex flex-col h-full p-4 pt-0 md:pt-4">
            <div className="flex gap-2 items-center text-sm">
                <div className="flex items-center gap-2 my-2 flex-wrap">
                    {note.tags && note.tags.length > 0 && note.tags.map((tag, i) => <TagButton key={tag} deleteTag={() => removeTag(tag)}>{tag}</TagButton>)}
                    <label className="w-32 block">
                        <span className="hidden">New Tag</span>
                        <TagAutoComplete onChange={setTag} value={tag} placeholder="Add Tag..." suggestions={filteredTags} onSubmit={addTag} isFetching={isFetching} />
                    </label>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-xl mt-2 mb-2 flex-grow">
                    <SlateEditor value={note.title} setValue={(value) => setNote({ ...note, title: value })} editorKey={note.id} placeholder="Title" />
                </div>
                {isSaving ? <p>Saving...</p> : isSaved ? <p>Saved</p> : null}
            </div>
            <div className={styles.content}>
                <SlateEditor value={note.content} setValue={(value) => setNote({ ...note, content: value })} editorKey={note.id} placeholder="Content" />
            </div>
        </div>
    )
}

function areArraysEqual(array1: string[] | undefined, array2: string[] | undefined) {
    if (!array1 || !array2) {
        return false;
    }
    const arr1 = [...array1];
    const arr2 = [...array2]
    if(arr1.sort().join(',') === arr2.sort().join(',')){
        return true
    }
    return false
}

export default NoteEditorMain;