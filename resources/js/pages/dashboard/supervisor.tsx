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
    const {presentCount, absentCount} = usePage<{
        presentCount: number,
        absentCount: number
    }>().props;

    const {auth: {user}} = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex gap-4">
                    <div className="flex-1 border rounded-xl p-6 flex flex-col justify-center">
                        <div className="text-sm text-neutral-400 font-bold">Welcome</div>
                        <div className="text-4xl font-black">{user.name}</div>
                        <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                    </div>
                    <div className='flex-1 flex gap-2'>
                        <div className='p-4 border rounded-xl flex-1 flex flex-col'>
                            <div className='text-center text-sm uppercase'>Present Today</div>
                            <div className='flex-1 mx-auto flex flex-col justify-center'>
                                <div className="text-6xl font-bold text-accent-foreground">{presentCount}</div>
                            </div>
                        </div>
                        <div className='p-4 border rounded-xl flex-1 flex flex-col'>
                            <div className='text-center text-sm uppercase'>Absent Today</div>
                            <div className='flex-1 mx-auto flex flex-col justify-center'>
                                <div className="text-6xl font-bold text-destructive">{absentCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className='text-2xl font-bold my-auto'>
                        Attendance
                    </div>
                    <DatePagination />
                </div>
                <LogList />
            </div>
        </AppLayout>
    );
}
