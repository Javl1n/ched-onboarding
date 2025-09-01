import { PageBlockInterface } from "@/types";
import { ReactNode } from "react";

export default function ParagraphBlock ({block}: {block: PageBlockInterface}) {
     return (
          <div dangerouslySetInnerHTML={{ __html: block.content }} />
     )
}