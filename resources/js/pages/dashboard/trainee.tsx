import QrAttendance from '@/components/timelog/qr';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import dashboard from '@/routes/dashboard';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
     {
        title: 'Dashboard',
        href: dashboard.trainee().url,
     },
];

export default function DashboardTrainee() {
     const {auth: {user}} = usePage<SharedData>().props;
     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Dashboard" />
               <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                         <div className="flex-1 overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border">
                              <div className='text-sm text-neutral-400 font-bold'>Welcome</div>
                              <div className='text-4xl font-black'>{user.name}</div>
                              <div className='mt-4 flex gap-4'>
                                   <QrAttendance />
                              </div>
                         </div>
                         
                         
                    </div>
                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                         <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
               </div>
          </AppLayout>
     );
}