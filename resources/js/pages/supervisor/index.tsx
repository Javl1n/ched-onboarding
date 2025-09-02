import CreateSupervisor from "@/components/supervisor/create";
import AppLayout from "@/layouts/app-layout";
import supervisor from "@/routes/supervisor";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Supervisors',
        href: supervisor.index().url,
    },
];

export default function SuperVisorIndex({supervisors}: {supervisors: User[]}) {
     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Supervisors" />
               <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="grid gap-4 md:grid-cols-3 flex-1">
                         <div className="col-span-1 flex flex-col">
                              <CreateSupervisor />
                         </div>
                         <div className="col-span-2">
                              
                         </div>
                    </div>
                    {/* <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div> */}
               </div>
          </AppLayout>
     )
}