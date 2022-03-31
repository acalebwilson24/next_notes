import { FC } from "react";

const TagButton: FC<{ deleteTag: {(): void} }> = ({ children, deleteTag }) => {
    return (
        <div className="bg-sky-100 hover:bg-sky-200 dark:bg-sky-600 py-1 px-2 rounded-md cursor-pointer" onClick={deleteTag}>{children}</div>
    )
}

export default TagButton;