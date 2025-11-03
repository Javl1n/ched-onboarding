import { SharedData, TimeLogInterface } from '@/types';
import { usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { CalendarCheck2 } from 'lucide-react';
import { MonthPagination } from './month-pagination';

export default function LogCalendar({ date, setDate }: { date: Date; setDate: (date: Date) => void }) {
    const {
        auth: { user },
        year,
        month,
        logs,
    } = usePage<
        SharedData & {
            logs: TimeLogInterface[];
            month: number;
            year: number;
            profile: string;
        }
    >().props;

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const total = (log: TimeLogInterface) => {
        return `${Math.floor(log.hours)} hr ${(log.hours % 1) * 60} min`;
    };

    return (
        <>
            <div className="justify-between md:flex">
                <div className="text-center text-2xl font-bold md:text-left">{format(date, 'MMMM yyyy')}</div>
                <MonthPagination />
            </div>
            <div className="flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <div className="flex h-full flex-col">
                    <div className="grid grid-cols-7">
                        {weekDays.map((day) => (
                            <div key={`day-${day}`} className="col-span-1 py-2 text-center text-sm text-neutral-400">
                                <span className="hidden sm:inline">{day}</span>
                                <span className="sm:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid flex-1 grid-cols-7">
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() }).map((_, index) => (
                            <div key={`day-before-${index}`} className="border p-1" />
                        ))}
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, index) => index + 1).map(
                            (day) => {
                                const log = logs.find((log) => new Date(log.date).getDate() === day);

                                return (
                                    <div
                                        onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), day))}
                                        key={`day-${day}`}
                                        className={`flex h-15 flex-col justify-between border p-1 transition md:h-30 ${date.getDate() === day ? 'bg-accent/50' : ''}`}
                                    >
                                        <div className="">{day}</div>

                                        {log ? (
                                            <>
                                                <div className="hidden text-right text-sm font-bold md:block">{total(log)}</div>
                                                <div className="flex justify-end md:hidden">
                                                    <CalendarCheck2 className="size-4" />
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                );
                            },
                        )}

                        {Array.from({ length: Math.abs(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay() - 7) }).map((_, index) => (
                            <div key={`day-after-${index}`} className="h-15 border p-1 md:h-30" />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
