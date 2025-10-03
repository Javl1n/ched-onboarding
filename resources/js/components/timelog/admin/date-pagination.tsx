import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import dashboard from "@/routes/dashboard";
import { SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { format } from "date-fns";

export function DatePagination() {
     const { date, auth: {user} } = usePage<SharedData & {date: string}>().props;
     
     const prev = {query: {
          date: format(new Date(new Date(date).setDate(new Date(date).getDate() - 1)), "yyyy-MM-dd")
     }};

     const next = {query: {
          date: format(new Date(new Date(date).setDate(new Date(date).getDate() + 1)), "yyyy-MM-dd")
     }};

     

     return (
          <div className="my-auto">
               <Pagination className="justify-end">
                    <PaginationContent>
                         <PaginationItem>
                              <PaginationPrevious size="sm" href={user.role == "admin" ? dashboard.admin(prev).url : dashboard.supervisor(prev).url} />
                         </PaginationItem>
                         <PaginationItem>
                              <PaginationLink href="#" size="sm">{format(new Date(date), "MMMM d")}</PaginationLink>
                         </PaginationItem>
                         {/* <PaginationItem>
                              <PaginationEllipsis />
                         </PaginationItem> */}
                         <PaginationItem>
                              <PaginationNext size="sm" href={user.role == "admin" ? dashboard.admin(next).url : dashboard.supervisor(next).url} />
                         </PaginationItem>
                    </PaginationContent>
               </Pagination>
          </div>
     )
}