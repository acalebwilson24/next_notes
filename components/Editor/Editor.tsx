import { convertFromHTML, Editor as DraftEditor, EditorState } from 'draft-js'
import { useEffect, useState } from 'react';
import { stateToHTML } from 'draft-js-export-html'

type Props = {
    value: string
    onChange: {(value: string) : void }
}

const Editor: React.FC<Props> = ({ value, onChange }) => {
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );

    useEffect(() => {
        // need to prevent update loop
        const stateAsHTML = stateToHTML(editorState.getCurrentContent());

        if (stateAsHTML !== value) {
            onChange(stateToHTML(editorState.getCurrentContent()))
        }
    }, [editorState])

    useEffect(() => {
        const blocksFromHTML = convertFromHTML(value);
        
    }, [value])

    return (
        <DraftEditor editorState={editorState} onChange={setEditorState} />
    )
}

export default Editor;