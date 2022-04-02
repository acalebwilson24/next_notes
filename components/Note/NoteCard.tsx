import { InflatedNote } from "../../redux/types";
import { Descendant, Node } from 'slate';
import { serialiseDescendants } from "../../utils/note";

const InflatedNoteCard: React.FC<InflatedNote & { selected?: boolean }> = ({ title, content, updatedAt, ...props }) => {
    function getDescendantString(content: Descendant[], trim = 50) {
        const contentString = serialiseDescendants(content);
        if (contentString.length > trim) {
            return contentString.substring(0, trim) + '...';
        }
        return contentString;
    }

    return (
        <div className={`p-4 h-32 flex flex-col ${props.selected ? "bg-sky-50 dark:bg-slate-700 dark:hover:bg-slate-700 hover:bg-sky-50" : "hover:bg-sky-50/30 hover:dark:bg-slate-800 "}`}>
            <h3 className="text-xl mb-1">{getDescendantString(title, 35)}</h3>
            <p className="text-slate-600 dark:text-slate-200 text-sm">{getDescendantString(content)}</p>
            <p className="text-xs mt-auto">
                Last updated: {updatedAt.toLocaleTimeString()} {updatedAt.toLocaleDateString()}
            </p>
        </div>
    )
}

export default InflatedNoteCard;