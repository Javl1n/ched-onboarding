import { PageBlockInterface } from '@/types';

export default function HeaderOneBlock({ block }: { block: PageBlockInterface }) {
    return <div className="text-3xl font-bold">{block.content}</div>;
}
