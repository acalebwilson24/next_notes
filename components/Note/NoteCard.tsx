import { InflatedNote } from "../../redux/types";

const InflatedNoteCard: React.FC<InflatedNote & { selected?: boolean }> = ({ title, content, updatedAt, ...props }) => {
    return (
        <div className={`p-4 h-32 flex flex-col ${props.selected && "bg-sky-50 dark:bg-slate-700"}`}>
            <h3 className="text-xl mb-1">{title.getCurrentContent().getPlainText("\n")}</h3>
            <p className="text-slate-600 dark:text-slate-200 text-sm">{content.getCurrentContent().getPlainText("\n").slice(0, 50).trim()}...</p>
            <p className="text-xs mt-auto">
                Last updated: {updatedAt.toLocaleTimeString()} {updatedAt.toLocaleDateString()}
            </p>
        </div>
    )
}

export default InflatedNoteCard;