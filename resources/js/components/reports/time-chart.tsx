import { TimeLogInterface } from '@/types';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';

export default function TimeChart() {
    const { logs } = usePage<{
        logs: TimeLogInterface[];
    }>().props;

    const hourMinute = (hours: number) => `${Math.floor(hours)} hr ${Math.round((hours % 1) * 60)} min`;

    const hourPerMonth = logs.reduce<{
        [key: string]: number;
    }>((accumulator, currentLog) => {
        const month = format(new Date(currentLog.date), 'MMMM yyyy');

        if (!accumulator[month]) {
            accumulator[month] = 0;
        }

        accumulator[month] += currentLog.hours;

        return accumulator;
    }, {});

    return (
        <div className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-2">
            {Object.keys(hourPerMonth).length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                    <p className="text-sm text-muted-foreground">No time logs yet</p>
                </div>
            ) : (
                Object.entries(hourPerMonth).map(([month, hours]) => (
                    <div key={month} className="flex items-center justify-between gap-3 rounded-lg border border-sidebar-border/50 bg-muted/30 px-3 py-2">
                        <span className="text-sm font-medium text-foreground">{month}</span>
                        <span className="text-sm font-bold text-primary">{hourMinute(hours)}</span>
                    </div>
                ))
            )}
        </div>
    );
}
