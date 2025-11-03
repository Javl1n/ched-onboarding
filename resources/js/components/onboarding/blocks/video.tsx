import { PageBlockInterface } from '@/types';

export default function VideoBlock({ block }: { block: PageBlockInterface }) {
    return <iframe className="aspect-video w-full" src={`${block.content}`}></iframe>;
}
