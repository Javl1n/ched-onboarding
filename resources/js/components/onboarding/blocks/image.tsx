import { PageBlockInterface } from '@/types';

export default function ImageBlock({ block }: { block: PageBlockInterface }) {
    return <img src={`/private/${block.content}`} alt={block.content} />;
}
