import { VFC, useState } from "react"
import { useGetTagsQuery } from "../../redux/noteApi"
import { filterTags } from "../../utils/tag"
import TagAutoComplete from "../TagAutoComplete"
import TagButton from "../TagButton"

type NoteEditorFilterProps = {
    search: string,
    setSearch: (s: string) => void
    tags: string[],
    setTags: (t: string[]) => void
    skip?: boolean
}   

const NoteEditorFilter: VFC<NoteEditorFilterProps> = ({ search, setSearch, tags, setTags, skip }) => {
    const { data: userTags, isFetching } = useGetTagsQuery({ tags }, { skip });
    const [newTag, setNewTag] = useState("");

    function removeTag(tag: string) {
        setTags(tags.filter(t => t !== tag));
    }

    return (
        <div className="p-4 flex flex-col gap-2">
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
    )
}

export default NoteEditorFilter;