import { InputHTMLAttributes } from 'react';
import Editor, { 
  BtnBold,
  BtnItalic,
  EditorProps,
  Toolbar
} from 'react-simple-wysiwyg';
import { BlockAttributes } from './block-layout';

export default function ParagraphInput({isNew, ...props}: EditorProps & BlockAttributes) {
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


                                   