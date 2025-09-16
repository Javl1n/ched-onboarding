import { DatePagination } from '@/components/timelog/admin/date-pagination';
import LogList from '@/components/timelog/admin/list';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.supervisor().url,
    },
];

export default function DashboardSupervisor() {
     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Dashboard" />
               <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    {/* <div className="flex min-h-40 gap-4">
                         <AttendanceScanner />
                    </div> */}
                    <LogList />
                    <DatePagination />
               </div>
          </AppLayout>
     );
}
