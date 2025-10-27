import { DatePagination } from '@/components/timelog/admin/date-pagination';
import LogList from '@/components/timelog/admin/list';
import AttendanceScanner from '@/components/timelog/admin/scanner';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { TimeLogInterface, type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.admin().url,
    },
];

export default function DashboardAdmin() {
    const {logs, date, totalTrainees, presentCount, absentCount, allDepartments} = usePage<{
        logs: TimeLogInterface[],
        date: string,
        totalTrainees: number,
        presentCount: number,
        absentCount: number,
        allDepartments: string[]
    }>().props;

    const {auth: {user}} = usePage<SharedData>().props;

    // Initialize all departments with 0 count
    const departmentsCount: {[key: string]: number} = allDepartments.reduce<{[key: string]: number}>((acc, dept) => {
        acc[dept] = 0;
        return acc;
    }, {});

    // Count present trainees by department
    logs.forEach(log => {
        const department = log.trainee.user.department.name;
        if (departmentsCount.hasOwnProperty(department)) {
            departmentsCount[department] += 1;
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="border rounded-xl p-6">
                    <div className="text-sm text-neutral-400 font-bold">Welcome</div>
                    <div className="text-4xl font-black">{user.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">{user.role}</div>
                </div>
                <div className="flex min-h-40 gap-4">
                    <AttendanceScanner />
                    <div className='flex-1 flex gap-2'>
                        <div className='p-2 border rounded-xl aspect-square flex flex-col'>
                            <div className='text-center text-sm uppercase'>Present Today</div>
                            <div className='flex-1 mx-auto flex flex-col justify-center'>
                                <div className="text-6xl font-bold text-accent-foreground">{presentCount}</div>
                            </div>
                        </div>
                        <div className='p-2 border rounded-xl aspect-square flex flex-col'>
                            <div className='text-center text-sm uppercase'>Absent Today</div>
                            <div className='flex-1 mx-auto flex flex-col justify-center'>
                                <div className="text-6xl font-bold text-destructive">{absentCount}</div>
                            </div>
                        </div>
                        <div className='flex-1 grid grid-rows-2 auto-cols-fr grid-flow-col gap-2'>
                            {Object.keys(departmentsCount).map(department => (
                                <div className='border rounded-xl p-4 flex justify-between'>
                                    <div className="my-auto text-sm font-bold text-secondary-foreground">{department}</div>
                                    <div className="my-auto text-4xl font-bold">{departmentsCount[department]}</div>
                                </div>
                            ))}
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
