import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import supervisor from "@/routes/supervisor";
import { BreadcrumbItem, User } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Supervisors',
        href: supervisor.index().url,
    },
];

export default function SuperVisorIndex({supervisors}: {supervisors: User[]}) {
     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                         <div className="col-span-1">
                              1
                         </div>
                         <div className="col-span-2">
                              <Table>
                                   <TableCaption>A list of Supervisors</TableCaption>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead className="w-[100px]">Invoice</TableHead>
                                             <TableHead>Status</TableHead>
                                             <TableHead>Method</TableHead>
                                             <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        <TableRow>
                                             <TableCell className="font-medium">INV001</TableCell>
                                             <TableCell>Paid</TableCell>
                                             <TableCell>Credit Card</TableCell>
                                             <TableCell className="text-right">$250.00</TableCell>
                                        </TableRow>
                                   </TableBody>
                              </Table>
                         </div>
                    </div>
                    {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div> */}
               </div>
          </AppLayout>
     )
}