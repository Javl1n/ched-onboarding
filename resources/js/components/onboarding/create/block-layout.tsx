import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CircleXIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface OnboardingInputAttributes {
    deleteBlock: () => void;
    error: string;
    onMove: (from: number, to: number) => void;
    position: { first: boolean; last: boolean };
    index: number;
}

export interface BlockAttributes {
    isNew?: boolean;
}

export default function BlockLayout({ children, deleteBlock, error, position, onMove, index }: { children: ReactNode } & OnboardingInputAttributes) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col">
                <div className="mx-auto h-6 w-px border-l-2" />
                <CircleXIcon
                    onClick={deleteBlock}
                    className="size-4 cursor-pointer rounded-full transition dark:outline-neutral-800 dark:hover:outline-2"
                />
                <div className="mx-auto w-px flex-1 border-l-2" />
            </div>
            <div className="my-2 flex-1">
                {children}
                <InputError message={error} />
            </div>
            <div className="my-auto">
                <Button onClick={() => onMove(index, index - 1)} variant={'ghost'} disabled={position.first}>
                    <ChevronUp />
                </Button>
                <Button onClick={() => onMove(index, index + 1)} variant={'ghost'} disabled={position.last}>
                    <ChevronDown />
                </Button>
            </div>
        </div>
    );
}
