import InputError from "@/components/input-error";
import { CircleXIcon } from "lucide-react";
import { ReactNode } from "react";

export interface OnboardingInputAttributes {
     deleteBlock?: () => void,
     error?: string
}

export default function BlockLayout({children, deleteBlock, error}: {children: ReactNode} & OnboardingInputAttributes) {
     return (
          <div className="flex gap-4">
               <div className="flex flex-col">
                    <div className='h-6 w-px border-l-2 mx-auto' />
                    <CircleXIcon onClick={deleteBlock} className='size-4 rounded-full dark:hover:outline-2 dark:outline-neutral-800 cursor-pointer transition' />
                    <div className='flex-1 w-px border-l-2 mx-auto' />
               </div>
               <div className="flex-1 my-2">
                    {children}
                    <InputError message={error} />
               </div>
          </div>
     )
}    