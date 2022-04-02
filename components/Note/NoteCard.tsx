import { InflatedNote } from "../../redux/types";
import { Node } from 'slate';

const InflatedNoteCard: React.FC<InflatedNote & { selected?: boolean }> = ({ title, content, updatedAt, ...props }) => {
    return (
        <div className={`p-4 h-32 flex flex-col ${props.selected ? "bg-sky-50 dark:bg-slate-700 dark:hover:bg-slate-700 hover:bg-sky-50" : "hover:bg-sky-50/30 hover:dark:bg-slate-800 "}`}>
            <h3 className="text-xl mb-1">{title.map(n => Node.string(n)).join('\n')}</h3>
            <p className="text-slate-600 dark:text-slate-200 text-sm">{title.map(n => Node.string(n)).join('\n').slice(0, 50).trim()}...</p>
            <p className="text-xs mt-auto">
                Last updated: {updatedAt.toLocaleTimeString()} {updatedAt.toLocaleDateString()}
            </p>
        </div>
    )
}

// import escapeHtml from 'escape-html'
// import { Descendant, Node, Text } from 'slate'

// const serialize = (node: Descendant) => {
//   if (Text.isText(node)) {
//     let string = escapeHtml(node.text)
//     if (node.bold) {
//       string = `<strong>${string}</strong>`
//     }
//     return string
//   }

//   const children = node.children.map(n => serialize(n)).join('')

//   switch (node.type) {
//     case 'quote':
//       return `<blockquote><p>${children}</p></blockquote>`
//     case 'paragraph':
//       return `<p>${children}</p>`
//     case 'link':
//       return `<a href="${escapeHtml(node.url)}">${children}</a>`
//     default:
//       return children
//   }
// }

export default InflatedNoteCard;