import { PageBlockInterface } from '@/types';

export default function HeaderThreeBlock({ block }: { block: PageBlockInterface }) {
    return <h4 className="text-xl font-semibold tracking-tight text-foreground">{block.content}</h4>;
}
