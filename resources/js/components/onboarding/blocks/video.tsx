import { PageBlockInterface } from '@/types';

export default function VideoBlock({ block }: { block: PageBlockInterface }) {
    return (
        <div className="overflow-hidden rounded-lg border border-border bg-muted/50 shadow-sm">
            <iframe
                className="aspect-video w-full"
                src={`${block.content}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}
