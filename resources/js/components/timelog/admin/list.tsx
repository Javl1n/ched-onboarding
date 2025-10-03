import { TimeLogInterface } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import {
     Table,
     TableBody,
     TableCaption,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import show from "@/routes/trainees/show";

export default function LogList() {
     const {logs, date} = usePage<{logs: TimeLogInterface[], date: string}>().props;
     console.log(date);

     const time = (time: string | undefined) => {
          return time ? format(time, "hh:mm aaa") : '---'
     }

     const total = (log: TimeLogInterface) => {
          return `${Math.floor(log.hours)} hr ${((log.hours % 1) * 60)} min`
     }

     const hours = (timeIn?: string, timeOut?: string) => {
          if (!timeIn || !timeOut) return;

          const timeStart = new Date(timeIn);
          const timeEnd = new Date(timeOut);
          const diffInMinutes = ((timeEnd.getTime() - timeStart.getTime()) / 60000);
          const hours = Math.floor(diffInMinutes / 60);

          return `(${hours} hr ${diffInMinutes % 60} min)`;
     }

     return (
          <div className="border rounded-xl overflow-clip">
               <Table>
                    <TableCaption>List of Time Logs in {format(new Date(date), "MMMM d, yyyy")}</TableCaption>
                    <TableHeader>
                         <TableRow>
                              <TableHead className="">Name</TableHead>
                              <TableHead>Department</TableHead>
                              <TableHead>Morning</TableHead>
                              <TableHead>Afternoon</TableHead>
                              <TableHead className="text-right">Time</TableHead>
                         </TableRow>
                    </TableHeader>
                    <TableBody>
                         {logs.map((log, index) => (
                              <TableRow onClick={() => router.visit(show.log(log.trainee.user).url)} key={index}>
                                   <TableCell className="font-medium">{log.trainee.user.name}</TableCell>
                                   <TableCell>{log.trainee.user.department.name}</TableCell>
                                   <TableCell>{time(log.morning_in)} - {time(log.morning_out)} {hours(log.morning_in, log.morning_out)}</TableCell>
                                   <TableCell>{time(log.afternoon_in)} - {time(log.afternoon_out)} {hours(log.afternoon_in, log.afternoon_out)}</TableCell>
                                   <TableCell className="text-right">{total(log)}</TableCell>
                              </TableRow>
                         ))}
                    </TableBody>
               </Table>
          </div>
     );
}