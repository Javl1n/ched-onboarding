import { InputHTMLAttributes } from 'react';
import Editor, { 
  BtnBold,
  BtnItalic,
  EditorProps,
  Toolbar
} from 'react-simple-wysiwyg';

export default function ParagraphInput(props: EditorProps) {
     return (
          <Editor placeholder='Type your paragraph here...' containerProps={{
               style: {
                    border: "none",
                    boxShadow: "none"
               }
          }} {...props}>
               {/* <Toolbar>
                    <BtnBold />
                    <BtnItalic />
               </Toolbar> */}
          </Editor>
     )
}