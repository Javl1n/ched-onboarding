import { MonthPagination } from '@/components/timelog/month-pagination';
import QrAttendance from '@/components/timelog/qr';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import dashboard, { trainee } from '@/routes/dashboard';
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

export default function DashboardTrainee({logs, month, year, profile}: {logs: TimeLogInterface[], month: number, year: number, profile: string}) {
     const [date, setDate] = useState(() => {
          const now = new Date();
          const date = new Date(year, month - 1);

          return now.getMonth() === (month - 1) && now.getFullYear() === year ? now : date;
     });



     const {auth: {user}} = usePage<SharedData>().props;
     const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

     const time = (time: string | undefined) => {
          console.log(time);
          return time ? format(time, "hh:mm aaa") : '--:-- --';
     }

     const total = (log: TimeLogInterface) => {
          return `${Math.floor(log.hours)} hr ${((log.hours % 1) * 60)} min`
     }

     const hours = (timeIn?: string, timeOut?: string) => {
          if (!timeIn || !timeOut) return;

          const timeStart = new Date(timeIn);
          const timeEnd = new Date(timeOut);
          const diffInMinutes = (timeEnd.getTime() - timeStart.getTime()) / 60000;
          const hours = Math.floor(diffInMinutes / 60);

          return `(${hours} hr ${diffInMinutes % 60} min)`;
     }

     return (
          <AppLayout breadcrumbs={breadcrumbs}>
               <Head title="Dashboard" />
               <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                         <div className="flex-2 flex gap-4 overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border">
                              <img className='w-30 rounded-lg' src={`/private/${profile}`} alt="" />
                              <div className="">
                                   <div className='text-sm text-neutral-400 font-bold'>Welcome</div>
                                   <div className='text-4xl font-black'>{user.name}</div>
                                   <div className='mt-4 flex gap-4'>
                                        <QrAttendance />
                                   </div>
                              </div>
                         </div>
                         <div className='flex-1 flex flex-col justify-between overflow-hidden rounded-xl p-4 border border-sidebar-border/70 dark:border-sidebar-border'>
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
                              </div>
                         </div>
                    </div>
                    <div className="flex justify-between">
                         <div className='text-2xl font-bold'>
                              {format(date, "MMMM yyyy")}
                         </div>
                         <MonthPagination />
                    </div>
                    <div className="min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                         <div className="flex flex-col h-full">
                              <div className="grid grid-cols-7">
                                   {weekDays.map((day) => (
                                        <div key={`day-${day}`} className='col-span-1 text-center py-2 text-neutral-400 text-sm'>
                                             {day}
                                        </div>
                                   ))}
                              </div>
                              <div className="grid grid-cols-7 flex-1">
                                   {Array.from({length: new Date(date.getFullYear(), date.getMonth(), 1).getDay()}).map((_, index) => (
                                        <div key={`day-before-${index}`} className='p-1 border'/>
                                   ))}
                                   {Array.from({length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}, (_, index) => index + 1).map((day) => {
                                        const log = logs.find((log) => new Date(log.date).getDate() === day);
                                        
                                        return (
                                             <div onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), day))} key={`day-${day}`} className='p-1 border flex flex-col justify-between h-30'>
                                                  <div className="">{day}</div>

                                                  {log ? <div className="text-right font-bold text-sm">
                                                       {total(log)}
                                                  </div> : null}
                                             </div>
                                        );
                                   })}
                                   
                                   {Array.from({length: Math.abs(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay() - 7)}).map((_, index) => (
                                        <div key={`day-after-${index}`} className='p-1 border' />
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>
          </AppLayout>
     );
}