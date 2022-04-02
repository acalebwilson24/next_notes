import { NextPage } from "next";
import { Editor } from "@tinymce/tinymce-react";
import { SlateEditor } from "../components/Editor/Editor";
import { Descendant } from "slate";
import { useState } from "react";

const TestPage: NextPage = () => {
    const [value, setValue] = useState<Descendant[]>([{ type: 'paragraph', children: [{ text: 'Hello there' }] }])

    return (
        <div className="max-w-7xl mx-auto bg-white w-full h-full p-8 my-8 rounded-lg shadow-lg flex flex-col">
            <h1 className="text-xl font-semibold mb-4 ">Slate Editor</h1>
            <SlateEditor value={value} setValue={setValue} />
        </div>
    );
}

export default TestPage;