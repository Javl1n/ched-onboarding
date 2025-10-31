import { usePage } from "@inertiajs/react";
import { TimeLogInterface } from "@/types";
import { format } from "date-fns";

export default function TimeChart() {
     const {logs} = usePage<{
          logs: TimeLogInterface[]
     }>().props;

     const hourMinute = (hours: number) => `${Math.floor(hours)} hr ${Math.round((hours % 1) * 60)} min`;

     const hourPerMonth = logs.reduce<{
          [key: string]: number
     }>((accumulator, currentLog) => {
          const month = format(new Date(currentLog.date), "MMMM yyyy");

          if (!accumulator[month]) {
               accumulator[month] = 0;
          }

          accumulator[month] += currentLog.hours;

          return accumulator
     }, {});

     return (
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-2">
               {Object.keys(hourPerMonth).length === 0 ? (
                    <div className="text-xs text-muted-foreground">No time logs yet</div>
               ) : (
                    Object.entries(hourPerMonth).map(([month, hours]) => (
                         <div key={month} className="flex justify-between items-center gap-3 px-2 py-1 rounded-md bg-muted">
                              <span className="text-xs font-medium text-foreground">{month}</span>
                              <span className="text-xs font-bold text-primary">{hourMinute(hours)}</span>
                         </div>
                    ))
               )}
          </div>
     )
}