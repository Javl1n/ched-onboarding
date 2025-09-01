import { InputHTMLAttributes } from "react";
import BlockLayout, { BlockAttributes, OnboardingInputAttributes } from "./block-layout";

export default function HeaderTwoInput({isNew, ...props}: InputHTMLAttributes<HTMLInputElement> & BlockAttributes) {
     return (
          <input className="outline-none w-full rounded p-3 text-2xl font-bold" placeholder="Header Here"  type="text" {...props} />
     )
}