import { InputHTMLAttributes } from "react";
import BlockLayout from "./block-layout";

export default function HeaderThreeInput({deleteBlock, ...props}: InputHTMLAttributes<HTMLInputElement>  & { deleteBlock?: () => void }) {
     return (
          <BlockLayout deleteBlock={deleteBlock}>
               <input className="outline-none w-full rounded p-3 text-xl font-bold" placeholder="Header Here"  type="text" {...props} />
          </BlockLayout>
     )
}