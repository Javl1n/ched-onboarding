import { PageBlockInterface } from '@/types';

export default function ParagraphBlock({ block }: { block: PageBlockInterface }) {
    return (
        <div
            className="prose-neutral prose prose-lg max-w-none text-foreground dark:prose-invert prose-headings:font-semibold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: block.content }}
        />
    );
}
