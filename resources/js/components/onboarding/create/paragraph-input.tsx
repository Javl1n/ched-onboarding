import Editor, { EditorProps } from 'react-simple-wysiwyg';
import { BlockAttributes } from './block-layout';

export default function ParagraphInput({ isNew, ...props }: EditorProps & BlockAttributes) {
    return (
        <Editor
            placeholder="Type your paragraph here..."
            className=""
            containerProps={{
                style: {
                    border: 'none',
                    boxShadow: 'none',
                },
            }}
            {...props}
        >
            {/* <Toolbar>
                    <BtnBold />
                    <BtnItalic />
               </Toolbar> */}
        </Editor>
    );
}
