import { InputHTMLAttributes } from "react";
import BlockLayout from "./block-layout";

export default function HeaderOneInput(props: InputHTMLAttributes<HTMLInputElement>  & { deleteBlock?: () => void }) {
     return (
          <BlockLayout deleteBlock={props.deleteBlock}>
               <input className="outline-none w-full rounded p-3 text-3xl font-bold" placeholder="Header Here"  type="text" {...props} />
          </BlockLayout>
     )
}