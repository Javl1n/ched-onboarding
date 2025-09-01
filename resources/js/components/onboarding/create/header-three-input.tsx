import { InputHTMLAttributes } from "react";
import BlockLayout, { BlockAttributes, OnboardingInputAttributes } from "./block-layout";

export default function HeaderThreeInput({isNew, ...props}: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
     return (
          <input className="outline-none w-full rounded p-3 text-xl font-bold" placeholder="Header Here"  type="text" {...props} />
     )
}