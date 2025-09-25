import { Bar, BarChart, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { usePage } from "@inertiajs/react";
import { TimeLogInterface } from "@/types";
import { format } from "date-fns";

export default function TimeChart() {
     const {logs} = usePage<{
          logs: TimeLogInterface[]
     }>().props;

     const hourMinute = (hours: number) => `${Math.floor(hours)} hr ${((hours % 1) * 60)} min`;

     const hourPerMonth = logs.reduce<{
          [key: string]: number
     }>((accumulator, currentLog) => {
          const month = format(new Date(currentLog.date), "MMMM");
          
          if (!accumulator[month]) {
               accumulator[month] = 0;
          }

          accumulator[month] += currentLog.hours;
          
          return accumulator
     }, {});

     const chartConfig = {
          hours: {
               label: "Hours",
               color: "#2563eb",
          },
     } satisfies ChartConfig;

     return (
          <ChartContainer  config={chartConfig} className="h-full">
               <BarChart accessibilityLayer data={[
                    ...Object.keys(hourPerMonth).map(month => ({month: month, hours: hourPerMonth[month]}))
               ]}>
                    <XAxis
                         dataKey={"month"}
                         tickLine={false}
                         tickMargin={10}
                         axisLine={false}
                         tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent/>} />
                    <Bar dataKey={"hours"} fill="var(--color-hours)" radius={4} width={10} />
               </BarChart>
          </ChartContainer>
     )
}