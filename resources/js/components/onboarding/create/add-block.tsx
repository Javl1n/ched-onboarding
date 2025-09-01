import { Heading1, Heading2, Heading3, Image as ImageIcon, LetterText, LucideIcon, SquarePlay } from "lucide-react";

const addButtons: {[key: string]: LucideIcon} = {
     paragraph: LetterText,
     header_one: Heading1,
     header_two: Heading2,
     header_three: Heading3,
     image: ImageIcon,
     video: SquarePlay,
     // file: Paperclip,
}

export default function AddBlock({addBlock}: {addBlock: (Button: string) => void}) {
     return (
          <div className="dark:bg-neutral-950 p-1 rounded-lg border-2 flex gap-1">
               {Object.keys(addButtons).map((Button: string, idx: number) => {
                    const ButtonComponent = addButtons[Button];
                    return (
                         <div onClick={() => addBlock(Button)} className="rounded p-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-500/50 cursor-pointer transition" key={`button-${idx}`}>
                              <ButtonComponent className="size-4" />
                         </div>
                    )
               })}
          </div>
     )
}