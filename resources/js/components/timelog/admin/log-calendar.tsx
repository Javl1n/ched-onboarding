import {
     Dialog,
     DialogClose,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import { SharedData, TimeLogInterface } from "@/types";
import { usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { CalendarCheck2 } from "lucide-react";
import { MonthPagination } from "./month-pagination";

export default function LogCalendar() {
     const {year, month, logs} = usePage<SharedData & {
          logs: TimeLogInterface[], month: number, year: number, profile: string
     }>().props;

     const date = new Date(year, month - 1);

     const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

     return (
          <>
               <div className="md:flex justify-between">
                    <div className='text-2xl font-bold text-center md:text-left'>
                         {format(date, "MMMM yyyy")}
                    </div>
                    <MonthPagination />
               </div>
               <div className="flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="flex flex-col h-full">
                         <div className="grid grid-cols-7">
                              {weekDays.map((day) => (
                                   <div
                                        key={`day-${day}`}
                                        className="col-span-1 text-center py-2 text-neutral-400 text-sm"
                                   >
                                        <span className="hidden sm:inline">{day}</span>
                                        <span className="sm:hidden">{day.charAt(0)}</span>
                                   </div>
                              ))}
                         </div>
                         <div className="grid grid-cols-7 flex-1">
                              {Array.from({length: new Date(date.getFullYear(), date.getMonth(), 1).getDay()}).map((_, index) => (
                                   <div key={`day-before-${index}`} className='p-1 border'/>
                              ))}
                              {Array.from({length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()}, (_, index) => index + 1).map((day) => <LogDialog key={`day-${day}`} day={day} />)}
                              
                              {Array.from({length: Math.abs(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay() - 7) % 7}).map((_, index) => (
                                   <div key={`day-after-${index}`} className='p-1 border h-15 md:h-30' />
                              ))}
                         </div>
                    </div>
               </div>
          </>
     );
}

function LogDialog ({day}: {day: number}) {
     const {year, month, logs} = usePage<SharedData & {
          logs: TimeLogInterface[], month: number, year: number, profile: string
     }>().props;

     const log = logs.find((log) => new Date(log.date).getDate() === day);

     const total = (log: TimeLogInterface) => {
          return `${Math.floor(log.hours)} hr ${((log.hours % 1) * 60)} min`;
     }

     const time = (time: string | undefined) => {
          return time ? format(time, "hh:mm aaa") : '--:-- --';
     }

     return (
          <Dialog>
               <DialogTrigger asChild>
                    <div className={`h-15 p-1 border flex flex-col justify-between md:h-30 transition`}>
                         <div className="">{day}</div>

                         {log ? 
                              <>
                                   <div className="text-right font-bold text-sm hidden md:block">
                                        {total(log)}
                                   </div>
                                   <div className="flex justify-end md:hidden">
                                        <CalendarCheck2 className="size-4" />
                                   </div>
                              </>
                         : null}
                    </div>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                         <DialogTitle>{format(new Date(year, month - 1, day), "MMMM d, yyyy")}</DialogTitle>
                         <DialogDescription/>
                    </DialogHeader>
                    <div className='text-sm'>
                         <div className=''>
                              <span className='font-bold'>Morning: </span>
                              {time(log?.morning_in)} - {time(log?.morning_out)}
                         </div>
                         <div className=''>
                              <span className='font-bold'>Afternoon: </span>
                              {time(log?.afternoon_in)} - {time(log?.afternoon_out)}
                         </div>
                         <div className=''>
                              <span className='font-bold'>Total: </span>
                              {total(log ?? {hours: 0} as TimeLogInterface)}
                         </div>
                    </div>
               </DialogContent>
          </Dialog>
     )
}