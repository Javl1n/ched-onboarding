import { PageBlockInterface } from "@/types";
import { ReactNode } from "react";

export default function ParagraphBlock ({block}: {block: PageBlockInterface}) {
     return (
          <div className="prose prose-neutral dark:text-white text-black prose-lg" dangerouslySetInnerHTML={{ __html: block.content }} />
     )
}