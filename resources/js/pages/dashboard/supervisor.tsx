import { DatePagination } from '@/components/timelog/admin/date-pagination';
import LogList from '@/components/timelog/admin/list';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { UserCheck, UserX } from 'lucide-react';

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

    const totalTrainees = presentCount + absentCount;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Welcome Header */}
                <div className="rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm dark:border-sidebar-border lg:p-8">
                    <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Welcome Back</div>
                    <div className="mt-1 text-3xl font-black lg:text-4xl">{user.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="rounded-full bg-primary/10 px-3 py-1 font-medium capitalize text-primary">{user.role}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex flex-wrap gap-3">
                    {/* Present Today */}
                    <div className="group relative min-w-[180px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-green-500/5 to-green-500/10 p-4 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-green-500/10 dark:to-green-500/20">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Present Today</div>
                                <div className="mt-1 text-3xl font-bold text-green-600 dark:text-green-400">{presentCount}</div>
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                    {totalTrainees > 0 ? Math.round((presentCount / totalTrainees) * 100) : 0}% attendance
                                </div>
                            </div>
                            <div className="rounded-lg bg-green-500/10 p-2">
                                <UserCheck className="size-5 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Absent Today */}
                    <div className="group relative min-w-[180px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-red-500/5 to-red-500/10 p-4 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-red-500/10 dark:to-red-500/20">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Absent Today</div>
                                <div className="mt-1 text-3xl font-bold text-red-600 dark:text-red-400">{absentCount}</div>
                                <div className="mt-0.5 text-xs text-muted-foreground">
                                    {totalTrainees > 0 ? Math.round((absentCount / totalTrainees) * 100) : 0}% absent
                                </div>
                            </div>
                            <div className="rounded-lg bg-red-500/10 p-2">
                                <UserX className="size-5 text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Section */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <h2 className="text-2xl font-bold">Attendance Logs</h2>
                        <DatePagination />
                    </div>
                    <LogList />
                </div>
            </div>
        </AppLayout>
    );
}
