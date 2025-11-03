import { DatePagination } from '@/components/timelog/admin/date-pagination';
import LogList from '@/components/timelog/admin/list';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.supervisor().url,
    },
];

export default function DashboardSupervisor() {
    const { presentCount, absentCount } = usePage<{
        presentCount: number;
        absentCount: number;
    }>().props;

    const {
        auth: { user },
    } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex gap-4">
                    <div className="flex flex-1 flex-col justify-center rounded-xl border p-6">
                        <div className="text-sm font-bold text-neutral-400">Welcome</div>
                        <div className="text-4xl font-black">{user.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                    </div>
                    <div className="flex flex-1 gap-2">
                        <div className="flex flex-1 flex-col rounded-xl border p-4">
                            <div className="text-center text-sm uppercase">Present Today</div>
                            <div className="mx-auto flex flex-1 flex-col justify-center">
                                <div className="text-6xl font-bold text-accent-foreground">{presentCount}</div>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col rounded-xl border p-4">
                            <div className="text-center text-sm uppercase">Absent Today</div>
                            <div className="mx-auto flex flex-1 flex-col justify-center">
                                <div className="text-6xl font-bold text-destructive">{absentCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="my-auto text-2xl font-bold">Attendance</div>
                    <DatePagination />
                </div>
                <LogList />
            </div>
        </AppLayout>
    );
}
