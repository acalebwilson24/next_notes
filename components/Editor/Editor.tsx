import { convertFromHTML, Editor as DraftEditor, EditorState } from 'draft-js'
import { FC, MutableRefObject, RefObject, useEffect, useRef, useState } from 'react';
import { stateToHTML } from 'draft-js-export-html'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react';
import { BaseEditor, createEditor, Descendant } from 'slate';

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

type Props = {
  value: string
  onChange: { (value: string): void }
}

const OldEditor: React.FC<Props> = ({ value, onChange }) => {
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

type SlateEditor = {
  value: Descendant[]
  setValue: (value: Descendant[]) => void
  editorKey?: string | number
  placeholder?: string
}

export const SlateEditor: FC<SlateEditor> = ({ value, setValue, editorKey, placeholder }) => {
  const [ editor ] = useState(() => withReact(createEditor()));

  return (
    <Slate value={value} onChange={setValue} editor={editor} key={editorKey}  >
      <Editable className="w-full" placeholder={placeholder} />
    </Slate>
  )

}

export default OldEditor;