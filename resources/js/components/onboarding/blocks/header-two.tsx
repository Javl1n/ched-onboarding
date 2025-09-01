import { PageBlockInterface } from "@/types";

export default function HeaderTwoBlock({block}: {block: PageBlockInterface}) {
     return (
          <div className="text-2xl font-bold">
               {block.content}
          </div>
     )
}