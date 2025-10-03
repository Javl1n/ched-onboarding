import LogCalendar from '@/components/timelog/trainee/log-calendar';
import QrAttendance from '@/components/timelog/trainee/qr';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { totalHours } from '@/lib/utils';
import dashboard from '@/routes/dashboard';
import { SharedData, TimeLogInterface, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
     {
        title: 'Dashboard',
        href: dashboard.trainee().url,
     },
];

export default function DashboardTrainee({
     logs, month, year, profile, total: hours, totalThisMonth: hoursThisMonth
}: {
     logs: TimeLogInterface[], 
     month: number, 
     year: number, 
     profile: string,
     total: number,
     totalThisMonth: number
}) {
     const [date, setDate] = useState(() => {
          const now = new Date();
          const date = new Date(year, month - 1);

          return now.getMonth() === (month - 1) && now.getFullYear() === year ? now : date;
     });

     const {auth: {user}} = usePage<SharedData>().props;

     const time = (time: string | undefined) => {
          console.log(time);
          return time ? format(time, "hh:mm aaa") : '--:-- --';
     }

     const total = (log: TimeLogInterface) => {
          return `${Math.floor(log.hours)} hr ${((log.hours % 1) * 60)} min`
     }


     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Dashboard" />
               <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                         <div className="flex-2 flex gap-4 overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border">
                              <img className='w-30 rounded-lg md:block hidden' src={`/private/${profile}`} alt="" />
                              <div className="h-full flex-1 flex flex-col justify-between">
                                   <div className="">
                                        <div className='text-sm text-neutral-400 font-bold'>Welcome</div>
                                        <div className='md:text-4xl font-black text-3xl'>{user.name}</div>
                                   </div>
                                   <div className='flex justify-between'>
                                        <div className="flex gap-2">
                                             <QrAttendance />
                                        </div>
                                        {/* <Separator orientation='vertical' className='' /> */}
                                        <div className="flex gap-2">
                                             <div className='my-auto text-sm text-secondary-foreground'>
                                                  Total Hours: <span className='font-bold'>{totalHours(hours)}</span>
                                             </div>
                                             <Separator orientation='vertical' className='' />
                                             <div className='my-auto text-sm text-secondary-foreground'>
                                                  This Month: <span className='font-bold'>{totalHours(hoursThisMonth)}</span>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                         <div className='flex-1 flex flex-col justify-between md:overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border'>
                              <div className="font-bold text-lg">{format(date, "MMMM dd, yyyy")}</div>
                              <div className='text-sm'>
                                   <div className=''>
                                        <span className='font-bold'>Morning: </span>
                                        {time(logs.find((log) => log.date === format(date, "yyyy-MM-dd"))?.morning_in)} - {time(logs.find((log) => log.date === format(date, "yyyy-MM-dd"))?.morning_out)}
                                   </div>
                                   <div className=''>
                                        <span className='font-bold'>Afternoon: </span>
                                        {time(logs.find((log) => log.date === format(date, "yyyy-MM-dd"))?.afternoon_in)} - {time(logs.find((log) => log.date === format(date, "yyyy-MM-dd"))?.afternoon_out)}
                                   </div>
                                   <div className=''>
                                        <span className='font-bold'>Total: </span>
                                        {total(logs.find((log) => log.date === format(date, "yyyy-MM-dd")) ?? {hours: 0} as TimeLogInterface)}
                                   </div>
                              </div>
                         </div>
                    </div>
                    <LogCalendar date={date} setDate={setDate} />
               </div>
          </AppLayout>
     );
}

// function MobileHeader() {
//      return (
//           <div>

//           </div>
//      )
// }

// function DesktopHeader() {
//      return (

//      );
// }