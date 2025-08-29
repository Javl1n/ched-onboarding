import { CircleXIcon } from "lucide-react";
import { ReactNode } from "react";

export default function BlockLayout({children, deleteBlock}: {children: ReactNode, deleteBlock?: () => void}) {
     return (
          <div className="flex gap-4">
               <div className="flex flex-col">
                    <div className='h-6 w-px border-l-2 mx-auto' />
                    <CircleXIcon onClick={deleteBlock} className='size-4 rounded-full hover:outline-2 outline-neutral-800 cursor-pointer transition' />
                    <div className='flex-1 w-px border-l-2 mx-auto' />
               </div>
               <div className="flex-1 my-2">
                    {children}
               </div>
          </div>
     )
}    