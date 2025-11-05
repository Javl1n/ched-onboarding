import { DatePagination } from '@/components/timelog/admin/date-pagination';
import LogList from '@/components/timelog/admin/list';
import AttendanceScanner from '@/components/timelog/admin/scanner';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { SharedData, TimeLogInterface, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Building2, UserCheck, Users, UserX } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.admin().url,
    },
];

export default function DashboardAdmin() {
    const { logs, date, totalTrainees, presentCount, absentCount, allDepartments } = usePage<{
        logs: TimeLogInterface[];
        date: string;
        totalTrainees: number;
        presentCount: number;
        absentCount: number;
        allDepartments: string[];
    }>().props;

    const {
        auth: { user },
    } = usePage<SharedData>().props;

    // Initialize all departments with 0 count
    const departmentsCount: { [key: string]: number } = allDepartments.reduce<{ [key: string]: number }>((acc, dept) => {
        acc[dept] = 0;
        return acc;
    }, {});

    // Count present trainees by department
    logs.forEach((log) => {
        const department = log.trainee.user.department.name;
        if (departmentsCount.hasOwnProperty(department)) {
            departmentsCount[department] += 1;
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Welcome Header */}
                <div className="rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm lg:p-8 dark:border-sidebar-border">
                    <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Welcome Back</div>
                    <div className="mt-1 text-3xl font-black lg:text-4xl">{user.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary capitalize">{user.role}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex flex-wrap gap-3">
                    {/* QR Scanner Card */}
                    <AttendanceScanner />

                    {/* Total Trainees */}
                    <div className="group relative min-w-[180px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-4 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-blue-500/10 dark:to-blue-500/20">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Total Trainees</div>
                                <div className="mt-1 text-3xl font-bold text-foreground">{totalTrainees}</div>
                            </div>
                            <div className="rounded-lg bg-blue-500/10 p-2">
                                <Users className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Present Today */}
                    <div className="group relative min-w-[180px] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-green-500/5 to-green-500/10 p-4 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-green-500/10 dark:to-green-500/20">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Present Today</div>
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
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Absent Today</div>
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

                {/* Department Stats */}
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 shadow-sm dark:border-sidebar-border">
                    <div className="mb-4 flex items-center gap-2">
                        <Building2 className="size-5 text-muted-foreground" />
                        <h2 className="text-lg font-bold">Department Overview</h2>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Object.keys(departmentsCount).map((department) => (
                            <div
                                key={department}
                                className="flex items-center justify-between rounded-lg border border-sidebar-border/50 bg-muted/30 p-4 transition-all hover:border-sidebar-border hover:bg-muted/50 dark:border-sidebar-border/30"
                            >
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-foreground">{department}</div>
                                    <div className="text-xs text-muted-foreground">Present</div>
                                </div>
                                <div className="text-3xl font-bold text-primary">{departmentsCount[department]}</div>
                            </div>
                        ))}
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
