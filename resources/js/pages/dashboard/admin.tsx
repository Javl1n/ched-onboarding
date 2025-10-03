import { DatePagination } from '@/components/timelog/admin/date-pagination';
import LogList from '@/components/timelog/admin/list';
import { MonthPagination } from '@/components/timelog/admin/month-pagination';
import AttendanceScanner from '@/components/timelog/admin/scanner';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { TimeLogInterface, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { count } from 'console';
import { Camera } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard.admin().url,
    },
];

export default function DashboardAdmin() {
    const {logs, date} = usePage<{logs: TimeLogInterface[], date: string}>().props;

    const departmentsCount: {[key: string]: number} = logs.reduce<{[key: string]: number}>
    ((accumulator, currentLog) => {
            const department = currentLog.trainee.user.department.name;
   
            if (!accumulator[department]) {
                accumulator[department] = 0;
            }
   
            accumulator[department] += 1;
   
            return accumulator;
        }, {});

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex min-h-40 gap-4">
                    <AttendanceScanner />
                    <div className='flex-1 flex gap-2'>
                        <div className='p-2 border rounded-xl aspect-square flex flex-col'>
                            <div className='text-center text-sm uppercase'>Present Today</div>
                            <div className='flex-1 mx-auto flex flex-col justify-center'>
                                <div className="text-6xl font-bold text-accent-foreground">{logs.length}</div>
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
