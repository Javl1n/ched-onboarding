import { Input } from "@/components/ui/input";
import BlockLayout from "./block-layout";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

export default function FileInput({deleteBlock, error, ...props}: InputHTMLAttributes<HTMLInputElement>  & { deleteBlock?: () => void, error: string }) {
     return (
          <BlockLayout deleteBlock={deleteBlock} error="">
               <div className="grid gap-2">
                    <Label>File Attachment:</Label>
                    <Input type="file" {...props} />
               </div>
          </BlockLayout>
     )
}