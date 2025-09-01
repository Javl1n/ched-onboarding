import { PageBlockInterface } from "@/types";

export default function HeaderThreeBlock({block}: {block: PageBlockInterface}) {
     return (
          <div className="text-xl font-bold">
               {block.content}
          </div>
     )
}