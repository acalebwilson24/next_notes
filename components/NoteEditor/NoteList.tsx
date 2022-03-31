import { SerialisedNote } from "../../redux/noteApi"
import { InflatedNote } from "../../redux/types"
import InflatedNoteCard from "../Note/NoteCard"

type Props = {
    notes: (SerialisedNote | InflatedNote)[],
    selected?: number
    setNoteID: {(id: number): void}
}

const NoteList: React.FC<Props> = ({ notes, selected, setNoteID }) => {
    return (
        <div className="flex flex-col divide-y divide-slate-200 border-b border-slate-200 dark:divide-slate-600 dark:border-slate-600">
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

export default NoteList;