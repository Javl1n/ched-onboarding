import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, CircleXIcon } from "lucide-react";
import { ReactNode } from "react";

export interface OnboardingInputAttributes {
     deleteBlock: () => void,
     error: string,
     onMove: (from: number, to: number) => void,
     position: {first: boolean, last: boolean},
     index: number
}

export interface BlockAttributes {
     isNew: boolean;
}

export default function BlockLayout({children, deleteBlock, error, position, onMove, index}: {children: ReactNode} & OnboardingInputAttributes) {
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
               <div className="my-auto">
                    <Button onClick={() => onMove(index, index - 1)} variant={'ghost'} disabled={position.first}>
                         <ChevronUp  />
                    </Button>
                    <Button onClick={() => onMove(index, index + 1)} variant={'ghost'} disabled={position.last}>
                         <ChevronDown />
                    </Button>
               </div>
          </div>
     )
}    