import { PageBlockInterface } from '@/types';

export default function HeaderOneBlock({ block }: { block: PageBlockInterface }) {
    return <h2 className="text-3xl font-bold tracking-tight text-foreground">{block.content}</h2>;
}
