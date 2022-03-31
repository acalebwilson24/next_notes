import { Editor } from "draft-js"
import React, { FC, ReactNode, useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../redux/configureStore"
import { useGetTagsQuery } from "../../redux/noteApi"
import { InflatedNote, TagAPIResponse } from "../../redux/types"
import { filterTags } from "../../utils/tag"
import Button from "../Button/Button"
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
        <div className="flex flex-col md:min-h-[700px] p-4 pt-0 md:pt-4">
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

const TagButton: FC<{ deleteTag: { (): void } }> = ({ children, deleteTag }) => {
    return (
        <div className="bg-sky-100 hover:bg-sky-200 py-1 px-2 rounded-md cursor-pointer" onClick={deleteTag}>{children}</div>
    )
}

type AutoCompleteProps = {
    suggestions: TagAPIResponse[]
    value: string
    onChange: { (value: string): void }
    placeholder?: string
    onSubmit: (value: string) => void
    isFetching?: boolean
}


// need to add keyboard select options
// return { name: string, count: number } from tags endpoint 
// to allow ordering suggestions by frequency
export const TagAutoComplete: FC<AutoCompleteProps> = ({ suggestions, placeholder, onChange, value, onSubmit, isFetching }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);
    })

    function handleClickOutside(e: MouseEvent) {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            setShowSuggestions(false);
        }
    }

    function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
        // e.preventDefault();
        if (e.key == "Enter") {
            onSubmit(value);
        }
    }


    function handleSelectSuggestion(suggestion: string) {
        onChange(suggestion);
        setTimeout(() => {
            onSubmit(suggestion);
        }, 10)
        setShowSuggestions(false);
    }

    function handleEnterSuggestion(e: React.KeyboardEvent<HTMLElement>, value: string) {
        if (e.key == "Enter") {
            handleSelectSuggestion(value);
        }
    }

    return (
        <div className="relative" ref={inputRef}>
            <input type="text" onClick={() => setShowSuggestions(true)} onFocus={() => setShowSuggestions(true)} value={value} onKeyDown={handleEnter} onChange={(e) => onChange(e.target.value)} className="py-1 px-2 focus:outline-slate-400 focus:outline-1 border-b border-slate-300" placeholder={placeholder} />
            {
                showSuggestions &&
                (
                    <ul className="absolute z-20 flex flex-col w-full border border-slate-300 divide-y divide-slate-300 bg-white" >
                        {isFetching ? <li className="py-2 px-2">Loading tags...</li> : suggestions.map((s, i) => (
                            <li
                                tabIndex={0}
                                className=" py-2 px-2 cursor-pointer hover:bg-sky-50"
                                key={i}
                                onClick={() => handleSelectSuggestion(s.tag)}
                                onKeyDown={(e) => handleEnterSuggestion(e, s.tag)}
                            >{s.tag} - {s.count}</li>
                        ))}
                    </ul>
                )
            }
        </div>
    )
}

export default NoteEditorMain;