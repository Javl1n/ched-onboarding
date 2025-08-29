import { InputHTMLAttributes } from 'react';
import Editor, { 
  BtnBold,
  BtnItalic,
  EditorProps,
  Toolbar
} from 'react-simple-wysiwyg';

import BlockLayout, { OnboardingInputAttributes } from './block-layout';

export default function ParagraphInput({deleteBlock, error, ...props}: EditorProps & OnboardingInputAttributes) {
     return (
          <BlockLayout deleteBlock={deleteBlock} error={error}>
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


                                   