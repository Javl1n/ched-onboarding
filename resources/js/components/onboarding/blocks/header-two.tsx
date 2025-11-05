import { PageBlockInterface } from '@/types';

export default function HeaderTwoBlock({ block }: { block: PageBlockInterface }) {
    return <h3 className="text-2xl font-semibold tracking-tight text-foreground">{block.content}</h3>;
}
