import { PageBlockInterface } from '@/types';

export default function ImageBlock({ block }: { block: PageBlockInterface }) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-muted/50">
            <img src={`/private/${block.content}`} alt={block.content} className="h-auto w-full object-cover" />
        </div>
    );
}
