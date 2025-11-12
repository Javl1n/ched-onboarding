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

    const today = new Date();
    const isToday = (day: number) => {
        return today.getDate() === day && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xl font-bold md:text-2xl">{format(date, 'MMMM yyyy')}</div>
                <MonthPagination />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 rounded-lg bg-muted/30 p-3 text-xs dark:bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Today</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded border-2 border-primary/30 bg-primary/10" />
                    <span className="text-muted-foreground">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-green-500/10">
                        <CalendarCheck2 className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-muted-foreground">Has Attendance</span>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-gradient-to-br from-card via-primary/[0.02] to-purple/[0.03] shadow-sm dark:border-sidebar-border">
                <div className="flex h-full flex-col">
                    {/* Week Day Headers */}
                    <div className="grid grid-cols-7 border-b border-sidebar-border/50 bg-gradient-to-r from-primary/5 to-purple/5 dark:border-sidebar-border/30">
                        {weekDays.map((day) => (
                            <div key={`day-${day}`} className="py-3 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                                <span className="sm:hidden">{day.charAt(0)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid flex-1 grid-cols-7">
                        {/* Empty cells before first day of month */}
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() }).map((_, index) => (
                            <div
                                key={`day-before-${index}`}
                                className="h-20 border-r border-b border-sidebar-border/30 bg-gradient-to-br from-muted/5 to-muted/10 md:h-28 dark:border-sidebar-border/20"
                            />
                        ))}

                        {/* Days of the month */}
                        {Array.from({ length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() }, (_, index) => index + 1).map(
                            (day) => {
                                const log = logs.find((log) => new Date(log.date).getDate() === day);
                                const isSelected = date.getDate() === day;
                                const isTodayDate = isToday(day);

                                return (
                                    <button
                                        type="button"
                                        onClick={() => setDate(new Date(date.getFullYear(), date.getMonth(), day))}
                                        key={`day-${day}`}
                                        className={`group relative flex h-20 flex-col justify-between border-r border-b border-sidebar-border/30 p-2 transition-all hover:bg-accent/50 focus:ring-2 focus:ring-primary/20 focus:outline-none md:h-28 md:p-3 dark:border-sidebar-border/20 ${
                                            isSelected
                                                ? 'bg-gradient-to-br from-primary/10 to-primary/20 ring-2 ring-primary/30 hover:from-primary/15 hover:to-primary/25 dark:from-primary/20 dark:to-primary/30'
                                                : log
                                                  ? 'bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-100 dark:from-green-500/10 dark:to-green-500/20'
                                                  : 'bg-gradient-to-br from-card to-muted/5 hover:from-muted/5 hover:to-muted/10'
                                        }`}
                                    >
                                        {/* Day Number */}
                                        <div className="flex items-start justify-between">
                                            <span
                                                className={`flex size-7 items-center justify-center rounded-full text-sm font-semibold transition-colors md:size-8 md:text-base ${
                                                    isTodayDate
                                                        ? 'bg-primary text-primary-foreground'
                                                        : isSelected
                                                          ? 'text-primary'
                                                          : log
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-foreground'
                                                }`}
                                            >
                                                {day}
                                            </span>
                                            {log && !isSelected && (
                                                <div className="rounded-full bg-green-500/20 p-1">
                                                    <CalendarCheck2 className="size-3 text-green-600 md:size-4 dark:text-green-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Hours Display */}
                                        {log && (
                                            <div className="text-right">
                                                <div className="hidden text-xs font-semibold text-foreground md:block">{total(log)}</div>
                                                <div className="text-[10px] text-muted-foreground md:text-xs">
                                                    {log.hours > 0 ? 'Logged' : 'Incomplete'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Hover Effect Overlay */}
                                        {!isSelected && (
                                            <div className="pointer-events-none absolute inset-0 rounded-sm opacity-0 ring-1 ring-primary/30 transition-opacity group-hover:opacity-100" />
                                        )}
                                    </button>
                                );
                            },
                        )}

                        {/* Empty cells after last day of month */}
                        {Array.from({ length: Math.abs(new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay() - 7) }).map((_, index) => (
                            <div
                                key={`day-after-${index}`}
                                className="h-20 border-r border-b border-sidebar-border/30 bg-gradient-to-br from-muted/5 to-muted/10 md:h-28 dark:border-sidebar-border/20"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
