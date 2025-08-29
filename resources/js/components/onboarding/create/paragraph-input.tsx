import { InputHTMLAttributes } from 'react';
import Editor, { 
  BtnBold,
  BtnItalic,
  EditorProps,
  Toolbar
} from 'react-simple-wysiwyg';

import BlockLayout from './block-layout';

export default function ParagraphInput({deleteBlock, ...props}: EditorProps & { deleteBlock?: () => void }) {
     return (
          <BlockLayout deleteBlock={deleteBlock}>
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
          </BlockLayout>
     )
}


                                   