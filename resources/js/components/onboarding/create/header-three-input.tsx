import { InputHTMLAttributes } from "react";
import BlockLayout, { OnboardingInputAttributes } from "./block-layout";

export default function HeaderThreeInput({deleteBlock, error, ...props}: InputHTMLAttributes<HTMLInputElement>  & OnboardingInputAttributes) {
     return (
          <BlockLayout deleteBlock={deleteBlock} error={error}>
               <input className="outline-none w-full rounded p-3 text-xl font-bold" placeholder="Header Here"  type="text" {...props} />
          </BlockLayout>
     )
}