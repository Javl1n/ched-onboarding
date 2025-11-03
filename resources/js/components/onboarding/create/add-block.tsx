import { Heading1, Heading2, Heading3, Image as ImageIcon, LetterText, LucideIcon, SquarePlay } from 'lucide-react';

const addButtons: { [key: string]: LucideIcon } = {
    paragraph: LetterText,
    header_one: Heading1,
    header_two: Heading2,
    header_three: Heading3,
    image: ImageIcon,
    video: SquarePlay,
    // file: Paperclip,
};

export default function AddBlock({ addBlock }: { addBlock: (Button: string) => void }) {
    return (
        <div className="flex gap-1 rounded-lg border-2 p-1 dark:bg-neutral-950">
            {Object.keys(addButtons).map((Button: string, idx: number) => {
                const ButtonComponent = addButtons[Button];
                return (
                    <div
                        onClick={() => addBlock(Button)}
                        className="cursor-pointer rounded p-1 transition hover:bg-neutral-200/50 dark:hover:bg-neutral-500/50"
                        key={`button-${idx}`}
                    >
                        <ButtonComponent className="size-4" />
                    </div>
                );
            })}
        </div>
    );
}
