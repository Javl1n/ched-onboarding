import { PageBlockInterface } from '@/types';

export default function ParagraphBlock({ block }: { block: PageBlockInterface }) {
    return <div className="prose prose-lg text-black prose-neutral dark:text-white" dangerouslySetInnerHTML={{ __html: block.content }} />;
}
