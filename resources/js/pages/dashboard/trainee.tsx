import LogCalendar from '@/components/timelog/trainee/log-calendar';
import QrAttendance from '@/components/timelog/trainee/qr';
import AppLayout from '@/layouts/app-layout';
import { totalHours } from '@/lib/utils';
import dashboard from '@/routes/dashboard';
import { SharedData, TimeLogInterface, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarDays, Clock, Timer, TrendingUp } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.trainee().url,
    },
];

export default function DashboardTrainee({
    logs,
    month,
    year,
    profile,
    total: hours,
    totalThisMonth: hoursThisMonth,
}: {
    logs: TimeLogInterface[];
    month: number;
    year: number;
    profile: string;
    total: number;
    totalThisMonth: number;
}) {
    const [date, setDate] = useState(() => {
        const now = new Date();
        const date = new Date(year, month - 1);

        return now.getMonth() === month - 1 && now.getFullYear() === year ? now : date;
    });

    const {
        auth: { user },
    } = usePage<SharedData>().props;

    const time = (time: string | undefined) => {
        console.log(time);
        return time ? format(time, 'hh:mm aaa') : '--:-- --';
    };

    const total = (log: TimeLogInterface) => {
        return `${Math.floor(log.hours)} hr ${(log.hours % 1) * 60} min`;
    };

    const selectedLog = logs.find((log) => log.date === format(date, 'yyyy-MM-dd'));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 lg:p-6">
                {/* Welcome Header with Profile */}
                <div className="rounded-xl border border-sidebar-border bg-card p-6 shadow-sm lg:p-8">
                    <div className="flex gap-6">
                        <img
                            className="hidden size-20 rounded-xl border-2 border-primary/20 object-cover shadow-md md:block lg:size-24"
                            src={`/private/${profile}`}
                            alt={user.name}
                        />
                        <div className="flex flex-1 flex-col justify-between">
                            <div>
                                <div className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Welcome Back</div>
                                <div className="mt-1 text-3xl font-black lg:text-4xl">{user.name}</div>
                                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary capitalize">{user.role}</div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <QrAttendance />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Total Hours Card */}
                    <div className="group relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Total Hours</div>
                                <div className="mt-1 text-3xl font-bold text-foreground">{totalHours(hours)}</div>
                                <div className="mt-1 text-xs text-muted-foreground">All time</div>
                            </div>
                            <div className="rounded-lg bg-blue-500/10 p-2.5">
                                <Clock className="size-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* This Month Card */}
                    <div className="group relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">This Month</div>
                                <div className="mt-1 text-3xl font-bold text-foreground">{totalHours(hoursThisMonth)}</div>
                                <div className="mt-1 text-xs text-muted-foreground">{format(date, 'MMMM yyyy')}</div>
                            </div>
                            <div className="rounded-lg bg-purple-500/10 p-2.5">
                                <TrendingUp className="size-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    {/* Selected Day Hours Card */}
                    <div className="group relative overflow-hidden rounded-xl border border-sidebar-border bg-card p-5 shadow-sm transition-all hover:shadow-md sm:col-span-2 lg:col-span-1">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                                <div className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Selected Day</div>
                                <div className="mt-1 text-3xl font-bold text-foreground">
                                    {total(selectedLog ?? ({ hours: 0 } as TimeLogInterface))}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">{format(date, 'MMMM dd, yyyy')}</div>
                            </div>
                            <div className="rounded-lg bg-green-500/10 p-2.5">
                                <Timer className="size-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Schedule Card */}
                <div className="rounded-xl border border-sidebar-border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2">
                        <CalendarDays className="size-5 text-muted-foreground" />
                        <h2 className="text-lg font-bold">{format(date, 'EEEE, MMMM dd, yyyy')}</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {/* Morning Session */}
                        <div className="rounded-lg border border-sidebar-border bg-muted/30 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="rounded-md bg-amber-500/10 p-1.5">
                                    <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="font-semibold text-foreground">Morning Session</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time In:</span>
                                    <span className="font-medium text-foreground">{time(selectedLog?.morning_in)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time Out:</span>
                                    <span className="font-medium text-foreground">{time(selectedLog?.morning_out)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Afternoon Session */}
                        <div className="rounded-lg border border-sidebar-border bg-muted/30 p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="rounded-md bg-sky-500/10 p-1.5">
                                    <Clock className="size-4 text-sky-600 dark:text-sky-400" />
                                </div>
                                <span className="font-semibold text-foreground">Afternoon Session</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time In:</span>
                                    <span className="font-medium text-foreground">{time(selectedLog?.afternoon_in)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time Out:</span>
                                    <span className="font-medium text-foreground">{time(selectedLog?.afternoon_out)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="rounded-xl border border-sidebar-border bg-card p-6 shadow-sm">
                    <h2 className="mb-4 text-2xl font-bold">Attendance Calendar</h2>
                    <LogCalendar date={date} setDate={setDate} />
                </div>
            </div>
        </AppLayout>
    );
}
