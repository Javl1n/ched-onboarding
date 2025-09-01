import { PageBlockInterface } from "@/types";

export default function VideoBlock({block}: {block: PageBlockInterface}) {
     return (
          <iframe className="w-full aspect-video rounded-lg"
               src={`${block.content}`}>
          </iframe> 
     )
}